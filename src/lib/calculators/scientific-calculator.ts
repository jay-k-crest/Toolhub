/**
 * Scientific Calculator Engine
 * Supports standard arithmetic, operator precedence (PEMDAS), brackets, trigonometric functions,
 * logarithms, powers, factorials, roots, and constants.
 */

export interface CalcHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type AngleMode = "deg" | "rad";

export function evaluateScientificExpression(expr: string, angleMode: AngleMode = "deg"): {
  result: number;
  error?: string;
} {
  try {
    if (!expr || expr.trim() === "") return { result: 0 };

    let sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, `${Math.PI}`)
      .replace(/e/g, `${Math.E}`);

    // Parse factorials (e.g. 5!)
    sanitized = sanitized.replace(/(\d+)!/g, (_, num) => {
      return `${factorial(parseInt(num, 10))}`;
    });

    // Custom Tokenizer & Recursive Descent Evaluator with support for scientific functions
    const result = parseMathExpression(sanitized, angleMode);
    if (isNaN(result) || !isFinite(result)) {
      return { result: 0, error: "Calculation Error (Undefined or Infinity)" };
    }
    return { result };
  } catch (err: any) {
    return { result: 0, error: err.message || "Syntax Error" };
  }
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= Math.min(n, 170); i++) res *= i;
  return res;
}

/**
 * Clean Recursive Descent Math Parser avoiding dangerous eval()
 */
class MathParser {
  private pos = 0;
  private str = "";
  private angleMode: AngleMode = "deg";

  constructor(str: string, angleMode: AngleMode) {
    this.str = str.replace(/\s+/g, "");
    this.angleMode = angleMode;
  }

  private peek(): string {
    return this.str.charAt(this.pos);
  }

  private get(): string {
    return this.str.charAt(this.pos++);
  }

  public parse(): number {
    this.pos = 0;
    const result = this.parseExpression();
    if (this.pos < this.str.length) {
      throw new Error(`Unexpected character: '${this.peek()}'`);
    }
    return result;
  }

  // Expr -> Term ((+ | -) Term)*
  private parseExpression(): number {
    let result = this.parseTerm();
    while (this.pos < this.str.length) {
      const op = this.peek();
      if (op === "+" || op === "-") {
        this.get();
        const nextTerm = this.parseTerm();
        result = op === "+" ? result + nextTerm : result - nextTerm;
      } else {
        break;
      }
    }
    return result;
  }

  // Term -> Factor ((* | / | %) Factor)*
  private parseTerm(): number {
    let result = this.parsePower();
    while (this.pos < this.str.length) {
      const op = this.peek();
      if (op === "*" || op === "/" || op === "%") {
        this.get();
        const nextFactor = this.parsePower();
        if (op === "*") result *= nextFactor;
        else if (op === "/") {
          if (nextFactor === 0) throw new Error("Division by zero");
          result /= nextFactor;
        } else if (op === "%") {
          result %= nextFactor;
        }
      } else {
        break;
      }
    }
    return result;
  }

  // Power -> Factor (^ Factor)*
  private parsePower(): number {
    let result = this.parseFactor();
    if (this.peek() === "^") {
      this.get();
      const exponent = this.parsePower(); // Right-associative
      result = Math.pow(result, exponent);
    }
    return result;
  }

  // Factor -> Unary | Number | Parentheses | Function
  private parseFactor(): number {
    // Unary minus
    if (this.peek() === "-") {
      this.get();
      return -this.parseFactor();
    }
    if (this.peek() === "+") {
      this.get();
      return this.parseFactor();
    }

    // Parentheses (Expr)
    if (this.peek() === "(") {
      this.get();
      const result = this.parseExpression();
      if (this.peek() !== ")") {
        throw new Error("Missing closing parenthesis");
      }
      this.get();
      return result;
    }

    // Check for named functions (sin, cos, tan, log, ln, sqrt, etc.)
    const nameMatch = this.str.slice(this.pos).match(/^(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs|exp)/i);
    if (nameMatch) {
      const fnName = nameMatch[1].toLowerCase();
      this.pos += fnName.length;

      if (this.peek() !== "(") {
        throw new Error(`Expected '(' after function ${fnName}`);
      }
      this.get();
      const arg = this.parseExpression();
      if (this.peek() !== ")") {
        throw new Error(`Missing ')' after function argument`);
      }
      this.get();

      return this.applyFunction(fnName, arg);
    }

    // Number literal
    const numMatch = this.str.slice(this.pos).match(/^(\d+(\.\d+)?([eE][+-]?\d+)?)/);
    if (numMatch) {
      this.pos += numMatch[0].length;
      return parseFloat(numMatch[0]);
    }

    throw new Error(`Invalid token at position ${this.pos}: '${this.peek()}'`);
  }

  private applyFunction(fn: string, val: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    switch (fn) {
      case "sin":
        return Math.sin(this.angleMode === "deg" ? toRad(val) : val);
      case "cos":
        return Math.cos(this.angleMode === "deg" ? toRad(val) : val);
      case "tan": {
        const rad = this.angleMode === "deg" ? toRad(val) : val;
        if (Math.abs(Math.cos(rad)) < 1e-12) throw new Error("Undefined (tan 90°)");
        return Math.tan(rad);
      }
      case "asin": {
        if (val < -1 || val > 1) throw new Error("asin domain is [-1, 1]");
        const rad = Math.asin(val);
        return this.angleMode === "deg" ? toDeg(rad) : rad;
      }
      case "acos": {
        if (val < -1 || val > 1) throw new Error("acos domain is [-1, 1]");
        const rad = Math.acos(val);
        return this.angleMode === "deg" ? toDeg(rad) : rad;
      }
      case "atan": {
        const rad = Math.atan(val);
        return this.angleMode === "deg" ? toDeg(rad) : rad;
      }
      case "log":
        if (val <= 0) throw new Error("Log domain error (val <= 0)");
        return Math.log10(val);
      case "ln":
        if (val <= 0) throw new Error("Ln domain error (val <= 0)");
        return Math.log(val);
      case "sqrt":
        if (val < 0) throw new Error("Square root of negative number");
        return Math.sqrt(val);
      case "cbrt":
        return Math.cbrt(val);
      case "abs":
        return Math.abs(val);
      case "exp":
        return Math.exp(val);
      default:
        throw new Error(`Unknown function: ${fn}`);
    }
  }
}

function parseMathExpression(expr: string, angleMode: AngleMode): number {
  const parser = new MathParser(expr, angleMode);
  return parser.parse();
}

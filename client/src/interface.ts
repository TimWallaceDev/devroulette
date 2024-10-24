export interface ChangeObject {
    from: { line: number; ch: number };
    to: { line: number; ch: number };
    text: string;
    removed: string;
}
import { ChangeObject } from "../interface";



export const applyChange = (editor: any, change: ChangeObject) => {
    const cm = editor.current.editor;

    try {
      // Apply the change
      cm.operation(() => {
        cm.replaceRange(change.text, change.from, change.to, "remote");
      });
    } catch (err) {
      console.error("Error applying changes:", err);
    }
  };
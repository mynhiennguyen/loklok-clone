import { CanvasUI } from "../src/types/interfaces/canvas";
import { Canvas2D } from "../src/types/canvas2D";
import { UndoManager } from "../src/types/undoManager";

jest.mock("../../src/types/canvas2D");

test("initialization", () => {
  //Set up mock
  //https://dev.to/focusedlabs/three-lines-of-typescript-with-jest-to-get-typesafe-mocks-3idj
  const mockedCanvas2d = <jest.Mock<Canvas2D>>Canvas2D;
  const canvas: CanvasUI = <jest.Mocked<Canvas2D>>new mockedCanvas2d();

  const undoManager = new UndoManager(canvas);
  expect(undoManager.undoStack.length).toBe(0);
  expect(undoManager.redoStack.length).toBe(0);
});

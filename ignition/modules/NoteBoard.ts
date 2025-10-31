import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NoteBoardModule = buildModule("NoteBoardModule", (m) => {
  const noteBoard = m.contract("NoteBoard");

  return { noteBoard };
});

export default NoteBoardModule;


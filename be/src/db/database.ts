import { Group } from "../types/group";
import { User } from "../types/user";

export interface Database {
  connect(): void;

  addUser(): void;
  getAllUsers(): void;

  addGroup(): void;
  getAllGroups(): void;
  getGroupsByUser(user: User): Group[];

  addGroupMembership(user: User, group: Group): void;
  deleteGroupMembership(user: User, goup: Group): void;
}

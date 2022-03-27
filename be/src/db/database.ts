import { Group } from "../types/group";
import { User } from "../types/user";

export interface Database {
  connect(): void;

  addUser(userId: string, userName: string): void;
  getAllUsers(): Promise<User[] | void> | undefined;

  addGroup(groupName: string): void;
  getAllGroups(): Promise<Group[] | void> | undefined;
  getGroupsByUser(userId: string): Promise<Group[] | void> | undefined;

  addGroupMembership(userId: string, groupId: string): void;
  deleteGroupMembership(groupMembershipId: string): void;
}

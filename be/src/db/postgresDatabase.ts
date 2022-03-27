import { Client } from "pg";
import { Group } from "../types/group";
import { User } from "../types/user";
import { Database } from "./database";

// TODO: use singleton pattern

export class PostgresDatabase implements Database {
  client: Client | null = null;

  connect(): void {
    this.client = new Client({
      connectionString: process.env.DATABASE_CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this.client.connect();
    this.getAllUsers();
  }
  addUser(userId: string, userName: string): void {
    this.client?.query(
      `INSERT INTO public."user"(id,name) VALUES(${userId},${userName})`
    );
  }
  getAllUsers(): Promise<User[] | void> | undefined {
    return this.client
      ?.query('SELECT * FROM public."user"')
      .then((res) => res.rows as User[])
      .catch((err) => console.error(err));
  }
  addGroup(groupName: string): void {
    this.client
      ?.query(
        `INSERT INTO public."group"(id,name) VALUES(gen_random_uuid(),${groupName})`
      )
      .catch((err) => console.log(err));
  }
  getAllGroups(): Promise<Group[] | void> | undefined {
    return this.client
      ?.query('SELECT * FROM public."group"')
      .then((res) => res.rows as Group[])
      .catch((err) => console.error(err));
  }
  getGroupsByUser(userId: string): Promise<Group[] | void> | undefined {
    return this.client
      ?.query(
        `SELECT * FROM public."group" LEFT JOIN public."group_membership" ON group.id=group_membership.${userId}`
      )
      .then((res) => res.rows as Group[])
      .catch((err) => console.error(err));
  }
  addGroupMembership(userId: string, groupId: string): void {
    this.client?.query(
      `INSERT INTO public."group"(user,group) VALUES(${userId}, ${groupId})`
    );
  }
  deleteGroupMembership(groupMembershipId: string): void {
    throw new Error("Method not implemented.");
  }
}

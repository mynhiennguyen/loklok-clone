import { Client, QueryResult } from "pg";
import { Group } from "../types/group";
import { User } from "../types/user";
import { Database } from "./database";

// TODO: use singleton pattern

export class PostgresDatabase implements Database {
  client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  connect(): void {
    this.client.connect().catch((err) => console.log(err));
  }
  addUser(
    userId: string | undefined,
    userName: string | undefined
  ): Promise<string | void> {
    if (!userId || !userName) {
      console.error(
        "Error while trying to add user. No userId oder userName was given"
      );
    }
    return this.client
      ?.query(
        `INSERT INTO public."user"(id,name) VALUES('${userId}'::UUID,'${userName}')
        RETURNING id
        `
      )
      .then((res) => res.rows[0].id as string)
      .catch((err) => console.log(err));
  }
  getAllUsers(): Promise<User[] | void> | undefined {
    return this.client
      ?.query('SELECT * FROM public."user"')
      .then((res) => res.rows as User[])
      .catch((err) => console.error(err));
  }
  addGroup(groupName: string): Promise<string | void> | undefined {
    return this.client
      .query(
        `INSERT INTO public."group"(id,name) VALUES(gen_random_uuid(),'${groupName}')
        RETURNING id`
      )
      .then((res) => res.rows[0].id as string)
      .catch((err) => console.log(err));
  }
  getAllGroups(): Promise<Group[] | void> | undefined {
    return this.client
      ?.query('SELECT * FROM public."group"')
      .then((res) => res.rows as Group[])
      .catch((err) => console.error(err));
  }
  getGroupsByUser(userId: string): Promise<Group[] | void> | undefined {
    console.log("Retrieving groups for user :", userId);
    return this.client
      ?.query(
        `SELECT id,name FROM public."group" LEFT JOIN public."group_membership" ON public."group".id=group_membership.group WHERE public."group_membership".user='${userId}'::UUID`
      )
      .then((res) => res.rows as Group[])
      .catch((err) => console.error(err));
  }

  addGroupMembership(userIds: string | string[], groupId: string): void {
    const userInsertPromises: Promise<QueryResult<any>>[] = [];
    Array.from(userIds).forEach((userId) => {
      userInsertPromises.push(
        this.client.query(
          `INSERT INTO public."group_membership"("user","group") VALUES('${userId}'::UUID, '${groupId}')`
        )
      );
    });
    Promise.all(userInsertPromises).catch((err) => console.log(err));
  }
  deleteGroupMembership(groupMembershipId: string): void {
    throw new Error("Method not implemented.");
  }
}

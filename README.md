# NestJS To-Do CRUD Application

## Overview
This project is a **To-Do CRUD application** built using **NestJS**. It allows users to manage their to-do tasks with support for **pagination**, **soft deletes**, and **status tracking**. The application stores tasks in a database using **TypeORM** and supports performing CRUD operations via a RESTful API.

## Features
- Create, Update, Delete, and Search tasks.
- **Soft delete** feature for tasks that can be restored.
- Pagination for fetching tasks in chunks.
- Count tasks based on their status (`waiting`, `active`, `done`).
- Search tasks by name or description.

## Technologies Used
- **NestJS**: A Node.js framework for building scalable applications.
- **TypeORM**: An ORM for TypeScript and JavaScript that runs in Node.js.
- **PostgreSQL**: (or any relational DB that TypeORM supports) for storing to-do data.
- **UUID**: A function to generate unique identifiers for tasks.

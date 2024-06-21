# Slidely AI Backend API

## Overview
This API allows clients to manage submissions by providing endpoints to create, read, and delete entries based on email addresses. The data is stored in a `db.json` file.

## Endpoints

### 1. Create Submission
- **URL**: `http://localhost:3000/submissions`
- **Method**: POST
- **Description**: Creates a new submission with the provided details.
- **Request Body**:
  - `email` (string): The email address of the submission.
  - `name` (string): The name associated with the submission.
  - Additional fields as required.
- **Response**:
  - **201 Created**: Submission created successfully.
    - **Body**: `{ "message": "Submission created successfully" }`
  - **400 Bad Request**: Invalid request data.
    - **Body**: `{ "error": "Invalid request data" }`
  - **500 Internal Server Error**: Error creating submission.
    - **Body**: `{ "error": "Failed to create submission" }`

### 2. Get All Submissions
- **URL**: `http://localhost:3000/submissions`
- **Method**: GET
- **Description**: Retrieves all submissions.
- **Response**:
  - **200 OK**: Successfully retrieved all submissions.
    - **Body**: JSON array of submissions.
  - **500 Internal Server Error**: Error retrieving submissions.
    - **Body**: `{ "error": "Failed to retrieve submissions" }`


### 3. Delete Submission by Email
- **URL**: `http://localhost:3000/delete`
- **Method**: DELETE
- **Description**: Deletes a submission based on the provided email.
- **Query Parameter**:
  - `email` (string): The email address of the submission to delete.
- **Response**:
  - **200 OK**: Submission deleted successfully.
    - **Body**: `{ "message": "Submission deleted successfully" }`
  - **400 Bad Request**: Invalid email format.
    - **Body**: `{ "error": "Invalid email format" }`
  - **404 Not Found**: Submission with the given email not found.
    - **Body**: `{ "error": "Submission not found" }`
  - **500 Internal Server Error**: Error deleting submission.
    - **Body**: `{ "error": "Failed to delete submission" }`

## Architecture

![Architecture](https://github.com/AjayDattu/SlideyAI-Backend/assets/126608028/7aa673d4-2a35-4681-8331-8585de7a43dc)

## Deployment

## Step 1: Clone the Repository from GitHub

Clone the repository using the following command:

```bash
 git clone https://github.com/AjayDattu/SlideyAI-Backend.git
```
## Step 2: Navigate to the Project Directory
```bash
 cd SlideyAI-Backend
```
```bash
cd backend
```
## Step 3 : Install Dependencies
```bash
npm install
```
## Step 4 : Compile TypeScript to JavaScript 
```bash
npx tsc
```
## Step 5: Start the Server
```bash
npx ts-node src/index.ts
```

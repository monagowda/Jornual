# Rollercoster REST API Documentation

This document provides a full specification of all REST API endpoints available in **Rollercoster**.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new user account and sets an HttpOnly JWT authentication cookie.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "email": "user@example.com",
      "createdAt": "2026-09-01T23:00:00.000Z",
      "preference": {
        "theme": "light",
        "primaryColor": "#7C3AED",
        "accentColor": "#DDD6FE",
        "backgroundColor": "#FAF5FF",
        "textColor": "#1F2937",
        "font": "Inter",
        "textSize": "medium"
      }
    }
  }
  ```

---

### `POST /api/auth/login`
Authenticates user credentials and sets an HttpOnly JWT cookie.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "email": "user@example.com"
    }
  }
  ```

---

### `POST /api/auth/logout`
Clears the user's authentication session cookie.

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### `GET /api/auth/me`
Fetches the currently authenticated user details.

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "email": "user@example.com"
    }
  }
  ```

---

## 2. Diary Entries Endpoints

### `GET /api/entries`
Fetches paginated list of diary entries for the authenticated user.

- **Query Parameters**:
  - `q`: Optional search term (title, content, or date).
  - `page`: Page number (default: `1`).
  - `limit`: Items per page (default: `20`).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "entries": [
        {
          "id": "entry-uuid",
          "date": "2026-09-01",
          "day": 1,
          "monthName": "SEP",
          "dayOfWeek": "TUE",
          "title": "A Beautiful Day",
          "previewText": "Today was a beautiful day..."
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
  ```

---

### `GET /api/entries/recent`
Fetches recent entries formatted specifically for the Home page 3/2/1 column cards grid.

- **Query Parameters**:
  - `limit`: Number of recent cards (default: `30`).

---

### `POST /api/entries`
Creates a new diary entry or updates an existing entry for the given date (enforces `UNIQUE(userId, date)`). Supports unlimited content writing.

- **Request Body**:
  ```json
  {
    "date": "2026-09-01",
    "title": "A Beautiful Day",
    "content": "<p>Unlimited diary writing content goes here...</p>"
  }
  ```

---

### `GET /api/entries/date/:date`
Retrieves entry details for a specific YYYY-MM-DD date.

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "entry-uuid",
      "date": "2026-09-01",
      "title": "A Beautiful Day",
      "content": "<p>Content...</p>"
    }
  }
  ```

---

### `GET /api/entries/:id`
Retrieves a single entry by ID. Enforces strict user ownership verification (`entry.userId === authUser.id`).

---

### `PUT /api/entries/:id`
Updates an existing diary entry title, content, or date.

- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "<p>Updated unlimited content...</p>",
    "date": "2026-09-01"
  }
  ```

---

### `DELETE /api/entries/:id`
Deletes a diary entry after verifying user ownership.

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Diary entry deleted successfully"
  }
  ```

---

## 3. Calendar Endpoints

### `GET /api/calendar/:year/:month`
Returns array of dates with saved diary entries for the requested month.

- **Example**: `GET /api/calendar/2026/09`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "year": 2026,
      "month": 9,
      "datesWithEntries": [
        "2026-09-01",
        "2026-09-05",
        "2026-09-12"
      ]
    }
  }
  ```

---

## 4. User Preferences & Customization Endpoints

### `GET /api/preferences`
Retrieves user theme, custom palette colors, font, and text size settings.

---

### `PUT /api/preferences`
Updates user theme, color palette, font, and text size settings.

- **Request Body**:
  ```json
  {
    "theme": "light",
    "primaryColor": "#7C3AED",
    "accentColor": "#DDD6FE",
    "backgroundColor": "#FAF5FF",
    "textColor": "#1F2937",
    "font": "Inter",
    "textSize": "medium"
  }
  ```

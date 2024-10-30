Lumos - Lessons App
This project is a full-stack web application designed for user registration and authentication. It utilizes NestJS for the backend and Next.js for the frontend, with TypeScript throughout. The app is set up with secure authentication processes, CORS handling, and structured entity relationships to allow role-based access and various functionalities.

Completed Features

	1.	Backend with NestJS
	•	Entity Models: Defined for User and Role, including the necessary relationships. The User entity includes various attributes like name, email, and nested location fields (district, province, city, country).
	•	Auth Module: Implemented auth.controller.ts and auth.service.ts for core authentication and authorization logic, including:
	•	JWT Token Generation and secure password hashing.
	•	Role retrieval for dynamic user assignment.
	•	API Routes: Configured routes under /api/auth prefix for user registration, login, and role fetching.
	•	Database Integration: Successfully connected to a PostgreSQL database with entities set up using TypeORM.
	2.	Frontend with Next.js
	•	User Registration Form: Created with dropdowns for country, province, city, and district populated dynamically through GeoNames API.
	•	Role-Based Dropdown: Fetches roles from the backend and displays them in a dropdown list.
	•	State Management: Managed using React hooks and structured API calls for roles and registration, with error handling.

Current Issues

	•	Error Handling Improvements: Enhance error responses for invalid role selections and other fields in the backend.
	•	API Response for Roles: Previously encountered issues with missing roles due to discrepancies in role ID vs. name assignments; needs a final check.
	•	UI Consistency: Ensure that all form dropdowns correctly display and retain user selections after form submissions.

Pending Features

	1.	Enhanced User Roles: Implement more comprehensive role-based access control (RBAC) features across the app.
	2.	Improved Validation: Both server- and client-side validation for all fields in registration, including stricter email, password, and location data validation.
	3.	Testing and Documentation:
	•	Add unit and integration tests in both frontend and backend to cover all critical paths.
	•	Complete this README with setup instructions, environment variable requirements, and API usage notes for contributors.

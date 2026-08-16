# Nexterview AI — API Documentation

Base URL (local): `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

---

## Auth (`/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register a new student account |
| POST | `/auth/login` | Public | Login, returns JWT token |
| GET | `/auth/me` | Private | Get logged-in user's basic info |

## Student Profile (`/student`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/student/profile` | Student | Get full profile |
| PUT | `/student/profile` | Student | Update name, college, branch, graduationYear, phone, skills |
| GET | `/student/dashboard-summary` | Student | Placement readiness score, skill graph, weekly progress |
| POST | `/student/certificates` | Student | Upload a certificate (multipart, field name: `certificate`) |
| DELETE | `/student/certificates/:certId` | Student | Remove a certificate |

## Resume (`/resume`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/resume` | Student | Create/update resume |
| GET | `/resume` | Student | Get own resume |
| GET | `/resume/download` | Student | Download resume as PDF |

## AI Features (`/ai`) — rate limited to 30 requests / 15 min per user
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/ai/resume-analysis` | Student | Body: `{ targetRole }` → ATS score + feedback |
| POST | `/ai/skill-gap` | Student | Body: `{ targetRole }` → missing skills + courses |
| POST | `/ai/career-roadmap` | Student | Body: `{ targetRole, experienceLevel }` → phased roadmap |
| POST | `/ai/interview-questions` | Student | Body: `{ role, type, count }` → generated questions |
| POST | `/ai/evaluate-answer` | Student | Body: `{ question, answer }` → score + feedback |
| POST | `/ai/cover-letter` | Student | Body: `{ jobDescription }` → generated cover letter |
| POST | `/ai/linkedin-suggestions` | Student | Body: `{ headline, about }` → improved profile text |
| POST | `/ai/ats-checker` | Student | Multipart: `resume` (PDF file) + `targetRole` → standalone ATS analysis, no saved resume needed |
| POST | `/ai/resume-jd-match` | Student | Body: `{ jobDescription }` → match % against your saved resume |
| POST | `/ai/career-chat` | Student | Body: `{ message, history }` → conversational career guidance reply |

## Jobs (`/jobs`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Any logged-in user | List active jobs |
| GET | `/jobs/recommended` | Student | Jobs ranked by skill match % against your profile |
| GET | `/jobs/:id` | Any logged-in user | Get single job |
| POST | `/jobs` | Admin | Create job posting |
| PUT | `/jobs/:id` | Admin | Update job posting |
| DELETE | `/jobs/:id` | Admin | Delete job posting |
| POST | `/jobs/:id/apply` | Student | Apply to a job |

## Companies (`/companies`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/companies` | Any logged-in user | List companies |
| GET | `/companies/:id` | Any logged-in user | Get company + its jobs |
| POST | `/companies` | Admin | Add a company |
| PUT | `/companies/:id` | Admin | Update a company |
| DELETE | `/companies/:id` | Admin | Remove a company |

## Code Execution (`/code`) — rate limited to 20 requests / 15 min per user
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/code/run` | Any logged-in user | Body: `{ code, language, stdin }` → runs code via Judge0, returns `{ stdout, stderr, compileOutput, status, time, memory }`. Supported languages: `javascript`, `python`, `java`, `cpp`, `c` |

## Tests (`/tests`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/tests` | Any logged-in user | List active tests (answers hidden) |
| GET | `/tests/:id` | Any logged-in user | Get test to attempt (answers hidden) |
| POST | `/tests` | Admin | Create a test with questions |
| POST | `/tests/:id/submit` | Student | Body: `{ answers: [{questionIndex, submittedAnswer}], timeTaken }` |
| GET | `/tests/results/me` | Student | Get own past test results |

## Admin (`/admin`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/admin/students` | Admin | List all students |
| GET | `/admin/students/:id` | Admin | Get student detail + test history |
| DELETE | `/admin/students/:id` | Admin | Remove a student |
| GET | `/admin/analytics` | Admin | Placement analytics overview |
| GET | `/admin/result-analysis` | Admin | Per-test stats + top performers |

---

## Response Format

All responses follow:
```json
{ "success": true, "data": { ... } }
```
or on error:
```json
{ "success": false, "message": "Error description" }
```

## Notes
- Coding test answers are auto-scored via **exact string match** against `correctAnswer` — not real code execution. For production, integrate a code execution sandbox (Judge0/Piston API).
- AI routes depend on `GROQ_API_KEY` being set; without it, all `/ai/*` routes will fail.

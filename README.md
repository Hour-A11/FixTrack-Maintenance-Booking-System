# FixTrack – Maintenance Booking System

A professional maintenance booking system with secure admin whitelisting and real-time dashboard tracking.

### Description
FixTrack is a simple and efficient web application for managing maintenance requests. It connects clients who need repairs with an administrator who manages the workflow. Clients can book a service, and the admin can track and update the status of every job.

---

### Features
* **Secure Admin Access**: Only authorized emails can access admin tools. Others are automatically registered as regular clients.
* **Real-time Stats**: The dashboard shows live counters for total, pending, in-progress, and completed requests.
* **Admin Controls**: Admins can change request statuses. To keep the view clean, control buttons disappear once a task is marked as completed.
* **Modern Notifications**: I used SweetAlert2 to show professional popup alerts instead of standard browser messages.
* **Smart Interface**: The UI changes based on the user's role. For example, the "New Request" button is hidden for admins so they can focus on management.

---

### Tools Used
* **Frontend**: HTML, CSS, and Vanilla JavaScript.
* **Backend**: Supabase (Database & Authentication).
* **Libraries**: SweetAlert2 for notifications and FontAwesome for icons.

---

### How to Use
1. Link your Supabase project in `supabase-config.js`.
2. Add your email to the `AUTHORIZED_ADMINS` list in `auth.js` to get admin rights.
3. Open `auth.html` to start.

---

### Developed By
**Hour Alhejress**

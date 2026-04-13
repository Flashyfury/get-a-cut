# ✂️ Get-a-Cut

Get-a-Cut is a modern, responsive web application designed to connect customers with local barbershops seamlessly. Featuring role-based dashboards, integrated maps, and a premium aesthetic, it simplifies the barbershop experience for both business owners and clients.

## 🌟 Features

### For Customers
* **Interactive Barber Search**: Discover nearby barbershops using an integrated, interactive map powered by Leaflet.
* **Customer Dashboard**: A centralized hub to view activity and find the perfect haircut.
* **Premium User Experience**: Enjoy a sleek, modern UI with glassmorphism effects and dark-mode optimizations.

### For Barbershop Owners
* **Shop Setup Workflow**: Easy onboarding and shop setup for new owners.
* **Owner Dashboard**: Manage your barbershop profile, visibility, and basic operations.

### Cross-Cutting Features
* **Secure Authentication**: Robust user authentication and session management powered by Supabase.
* **Role-Based Access**: Specialized views and routing depending on user accounts (Customer vs. Shop Owner).

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 + Vite
* **Routing**: React Router DOM (v7)
* **Backend / Auth / Database**: Supabase
* **Maps Integration**: Leaflet & React-Leaflet
* **Styling**: Pure CSS / CSS Modules with modern variable-based design tokens

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if applicable) or download the files.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase connection strings:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔮 Future Improvements

While Get-a-Cut currently provides a solid foundation for finding and managing barbershops, the following features are planned for future releases to enhance utility:

1. **Appointment Scheduling System**: Implement calendar integrations to allow customers to book specific time slots with individual barbers.
2. **Payment Gateway Integration**: Add seamless checkout options (e.g., Stripe, PayPal) so customers can pay for haircuts or tip their barber directly through the app.
3. **Review & Rating System**: Allow customers to rate their experiences and leave reviews for shops, giving future users better insights.
4. **User Profiles & Favorites**: Let customers maintain personal profiles (haircut history/preferences) and save their favorite barbershops for quick access.
5. **Real-time Notifications**: Notify owners when a new booking is made, and remind customers of upcoming appointments via email or SMS.
6. **Advanced Filtering**: Enhance the map and search functionality with filters for services offered, price ranges, and current wait times.

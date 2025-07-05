# PW Skills Courses Platform

![PW Skills Banner](https://raw.githubusercontent.com/thegitguru/pw-skills-clone/73918b2511424feaa571086609f94ba173617887/logo.svg)

Welcome to the **PW Skills Courses Platform**, a dynamic web application showcasing free and paid courses, mentors, testimonials, and success stories from PW Skills. Built with modern web technologies, this project provides an engaging, responsive, and user-friendly experience for exploring educational content.

## 🚀 Features

- **Responsive Navigation**: A sleek, mobile-friendly navigation menu with smooth animations and dropdown support.
- **Course Listings**: Displays free and paid courses with rich metadata, including duration, enrollment count, and registration status.
- **Enhanced Course Meta**: Visual progress bars and tooltips for average salary hikes, highest salaries, career transitions, and hiring partners.
- **Mentor Profiles**: Detailed mentor cards with social links, company logos, and experience highlights.
- **Testimonials & Success Stories**: Interactive carousel for success stories and grid-based testimonials.
- **Hiring Partners**: Showcase of partner company logos with a clean, grid-based layout.
- **Search & Filter**: Real-time search and category filtering for courses, mentors, and testimonials.
- **Dark Theme**: Modern dark-themed UI with smooth transitions and animations powered by Tailwind CSS and Animate.css.
- **API Integration**: Fetches data from the PW Skills API with caching for improved performance.

## 🛠️ Tech Stack

- **HTML5**: Semantic markup for accessibility and structure.
- **CSS3 (Tailwind CSS)**: Utility-first CSS framework for responsive and modern styling.
- **JavaScript**: Dynamic functionality, API fetching, and DOM manipulation.
- **Font Awesome**: Icons for enhanced visual appeal.
- **Animate.css**: Smooth animations for cards and transitions.
- **DOMPurify**: Sanitizes API data to prevent XSS attacks.
- **API**: Integrates with `https://api.pwskills.com/v2/course/revampedHome` for dynamic content.

## 📂 Project Structure

```plaintext
├── index.html          # Main HTML file with enhanced navigation and course meta
├── README.md           # Project documentation (this file)
├── assets/             # Static assets (images, etc., if added)
└── scripts/            # JavaScript files (if modularized in future updates)
```

## 📸 Screenshots

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop Screenshot](https://github.com/thegitguru/pw-skills-clone/blob/main/desktop-view.png) | ![Mobile Screenshot](https://github.com/thegitguru/pw-skills-clone/blob/main/mobile-view.png) |

## 🏁 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)
- Internet connection for API data fetching
- Optional: Local server (e.g., Live Server extension for VS Code) for development

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/thegitguru/pw-skills-clone.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd pw-skills-clone
   ```

3. **Open the Project**:
   - Open `index.html` in a web browser directly, or
   - Use a local server (e.g., `npx live-server`) for a better development experience.

### Dependencies

The project uses CDN-hosted dependencies:
- [Tailwind CSS](https://cdn.tailwindcss.com)
- [Font Awesome](https://cdnjs.com/libraries/font-awesome)
- [Animate.css](https://cdnjs.com/libraries/animate.css)
- [DOMPurify](https://cdnjs.com/libraries/dompurify)

No additional installation is required for these dependencies.

## 🎮 Usage

1. **Explore Courses**:
   - Navigate to "Free Courses" or "Paid Courses" using the top navigation menu.
   - Use the search bar to find specific courses or mentors.
   - Filter paid courses by category using the filter buttons.

2. **View Mentors & Testimonials**:
   - Browse mentor profiles with detailed experience and social links.
   - Read testimonials and success stories in the dedicated sections.

3. **Mobile Experience**:
   - On mobile devices, tap the hamburger menu to access the slide-in navigation.
   - Dropdown menus are tap-friendly with smooth transitions.

4. **API Data**:
   - The page fetches data from the PW Skills API on load.
   - Cached data is used if the API is unavailable, with a 1-hour cache expiration.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the Repository**:
   Click the "Fork" button on GitHub to create your own copy.

2. **Make Changes**:
   Implement your feature or bug fix, ensuring code quality and consistency.

3. **Test Locally**:
   Verify that your changes work as expected in multiple browsers.

4. **Submit a Pull Request**:
   Push your changes and open a pull request with a clear description.

### Contribution Guidelines

- Follow the existing code style (use Prettier for formatting if possible).
- Ensure responsiveness across desktop and mobile devices.
- Test API integration and fallback behavior.
- Update this README if new features are added.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

For questions or feedback, reach out via:
- **GitHub Issues**: [Open an issue](https://github.com/thegitguru/pw-skills-clone/issues)

## 🙌 Acknowledgments

- [PW Skills](https://pwskills.com) for the API and inspiration.
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling.
- [Font Awesome](https://fontawesome.com) for icons.
- [Animate.css](https://animate.style) for animations.

---

⭐ **Star this repository if you find it useful!** ⭐
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive);
        hamburger.querySelector('i').classList.toggle('fa-bars');
        hamburger.querySelector('i').classList.toggle('fa-times');
    });
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.setAttribute('aria-expanded', 'false');
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = toggle.parentElement;
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    // Add smooth scrolling for footer links
    document.querySelectorAll('.footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
const sanitize = (html) => DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } });
let allCourses = [];
let paidCategories = [];
let mentors = [];
let testimonials = [];
let companiesLogos = [];
let successStories = [];
let categories = [];
function getRegistrationStatus(startDate, endDate) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (!start || !end) return 'N/A';
    return now >= start && now <= end ? 'Open' : 'Closed';
}
function showSkeletonLoader(container, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'animate-pulse bg-gray-700 rounded-xl h-64';
        fragment.appendChild(div);
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}
async function fetchData() {
    const cacheKeyCourses = 'pwSkillsCoursesData';
    const cacheKeyCategories = 'pwSkillsCategoriesData';
    const cacheExpiration = 60 * 60 * 1000;
    const cachedCourses = JSON.parse(localStorage.getItem(cacheKeyCourses));
    const cachedCategories = JSON.parse(localStorage.getItem(cacheKeyCategories));
    const now = new Date().getTime();
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const freeCoursesContainer = document.getElementById('freeCoursesContainer').querySelector('div');
    const paidCoursesContainer = document.getElementById('paidCoursesContainer').querySelector('div');
    const mentorsContainer = document.getElementById('mentorsContainer').querySelector('div');
    const testimonialsContainer = document.getElementById('testimonialsContainer').querySelector('div');
    const successStoriesContainer = document.getElementById('successStoriesContainer').querySelector('.carousel-inner');
    const companiesLogosContainer = document.getElementById('companiesLogosContainer').querySelector('div');
    const filterButtons = document.querySelector('.filter-buttons');
    loader.style.display = 'block';
    errorMessage.style.display = 'none';
    showSkeletonLoader(freeCoursesContainer, 6);
    showSkeletonLoader(paidCoursesContainer, 6);
    showSkeletonLoader(mentorsContainer, 4);
    showSkeletonLoader(testimonialsContainer, 3);
    showSkeletonLoader(successStoriesContainer, 3);
    companiesLogosContainer.innerHTML = '';
    filterButtons.innerHTML = `
                <button class="filter-btn active" data-filter="all" aria-label="Show all content" aria-pressed="true" aria-describedby="filter-all-desc">
                    <i class="fas fa-th"></i>
                    All Courses
                    <span class="spinner"></span>
                </button>
                <span id="filter-all-desc" class="sr-only">Filter to display all available courses</span>
            `;
    try {
        let courseData, categoryData;
        const fetchCourses = async () => {
            if (cachedCourses && cachedCourses.timestamp && now - cachedCourses.timestamp < cacheExpiration) {
                return cachedCourses.data;
            }
            const response = await fetch('https://api.pwskills.com/v2/course/revampedHome');
            if (!response.ok) throw new Error(`Courses API error: ${response.status}`);
            const data = await response.json();
            if (!data.data) throw new Error('Invalid courses data format');
            localStorage.setItem(cacheKeyCourses, JSON.stringify({ data, timestamp: now }));
            return data;
        };
        const fetchCategories = async () => {
            if (cachedCategories && cachedCategories.timestamp && now - cachedCategories.timestamp < cacheExpiration) {
                return cachedCategories.data;
            }
            const response = await fetch('https://api.pwskills.com/v2/course/list-categories');
            if (!response.ok) throw new Error(`Categories API error: ${response.status}`);
            const data = await response.json();
            if (!data.data) throw new Error('Invalid categories data format');
            localStorage.setItem(cacheKeyCategories, JSON.stringify({ data, timestamp: now }));
            return data;
        };
        [courseData, categoryData] = await Promise.all([fetchCourses(), fetchCategories()]);
        processData(courseData.data, categoryData.data);
    } catch (error) {
        loader.style.display = 'none';
        if (cachedCourses && cachedCategories) {
            processData(cachedCourses.data, cachedCategories.data);
            errorMessage.textContent = 'Using cached data due to network error.';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.textContent = error.message || 'An error occurred while fetching data.';
            errorMessage.style.display = 'block';
            freeCoursesContainer.innerHTML = '<p class="text-center">No free courses available.</p>';
            paidCoursesContainer.innerHTML = '<p class="text-center">No paid courses available.</p>';
            mentorsContainer.innerHTML = '<p class="text-center">No mentors available.</p>';
            testimonialsContainer.innerHTML = '<p class="text-center">No testimonials available.</p>';
            successStoriesContainer.innerHTML = '<p class="text-center">No success stories available.</p>';
            companiesLogosContainer.innerHTML = '<p class="text-center">No hiring partners available.</p>';
        }
    }
}
function processData(courseData, categoryData) {
    const loader = document.getElementById('loader');
    const freeCoursesContainer = document.getElementById('freeCoursesContainer').querySelector('div');
    const paidCoursesContainer = document.getElementById('paidCoursesContainer').querySelector('div');
    const mentorsContainer = document.getElementById('mentorsContainer').querySelector('div');
    const testimonialsContainer = document.getElementById('testimonialsContainer').querySelector('div');
    const successStoriesContainer = document.getElementById('successStoriesContainer').querySelector('.carousel-inner');
    const companiesLogosContainer = document.getElementById('companiesLogosContainer').querySelector('div');
    const filterButtons = document.querySelector('.filter-buttons');
    loader.style.display = 'none';
    categories = categoryData || [];
    allCourses = [
        ...(courseData.freeCourses || []).map(course => {
            const category = categories.find(cat => cat.categoryId === course.parentCategoryId?._id);
            return {
                ...course,
                type: 'free',
                categoryTitle: category?.title || course.parentCategoryId?.title || 'N/A',
                categoryIcon: category?.icon || 'https://placehold.co/24',
                categoryId: category?.categoryId || course.parentCategoryId?._id,
                categorySlug: category?.slug || 'course'
            };
        }),
        ...(courseData.paidCourses || []).flatMap(category =>
            category.courseDetails.map(course => {
                const cat = categories.find(c => c.title === category.title);
                return {
                    ...course,
                    type: 'paid',
                    categoryTitle: category.title,
                    categorySlug: cat?.slug || category.slug || 'course',
                    categoryColor: category.categoryColor,
                    categoryIcon: cat?.icon || 'https://placehold.co/24',
                    categoryId: cat?.categoryId
                };
            })
        )
    ];
    paidCategories = courseData.paidCourses || [];
    mentors = courseData.mentors || [];
    testimonials = courseData.testimonials || [];
    companiesLogos = courseData.companiesLogos || [];
    successStories = courseData.successStories || [];
    const filterFragment = document.createDocumentFragment();
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = category.categoryId;
        button.setAttribute('aria-label', `Filter by ${category.title}`);
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-describedby', `filter-${category.categoryId}-desc`);
        button.innerHTML = `
                    <img src="${sanitize(category.icon || 'https://placehold.co/24')}" alt="${sanitize(category.title)} icon" class="category-icon">
                    ${sanitize(category.title)}
                    <span class="spinner"></span>
                `;
        filterFragment.appendChild(button);
        const desc = document.createElement('span');
        desc.id = `filter-${category.categoryId}-desc`;
        desc.className = 'sr-only';
        desc.textContent = `Filter to display ${category.title} courses`;
        filterFragment.appendChild(desc);
    });
    filterButtons.appendChild(filterFragment);
    renderCourses(allCourses.filter(course => course.type === 'free'), freeCoursesContainer, 'free');
    renderPaidCourses(paidCategories);
    renderMentors(mentors);
    renderTestimonials(testimonials);
    renderSuccessStories(successStories);
    renderCompanies(companiesLogos);
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                filterContent(button.dataset.filter);
            }, 500);
        });
    });
    let debounceTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const searchTerms = e.target.value.toLowerCase().split(' ').filter(term => term);
            filterContent(document.querySelector('.filter-buttons .filter-btn.active').dataset.filter, searchTerms);
        }, 300);
    });
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentSlide = 0;
    function updateCarousel() {
        const carouselInner = successStoriesContainer;
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.carousel-item').forEach((item, index) => {
            item.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
        });
    }
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentSlide < successStories.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
}
function renderCourses(courses, container, type) {
    const fragment = document.createDocumentFragment();
    if (courses.length > 0) {
        courses.forEach(course => {
            const registrationStatus = getRegistrationStatus(course.registration.startDate, course.registration.endDate);
            const courseDiv = document.createElement('div');
            courseDiv.className = 'mb-6';
            courseDiv.innerHTML = `
                        <div class="course-card bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.03] transition duration-300 overflow-hidden animate__animated animate__zoomIn">
                            <img src="${sanitize(course.img || 'https://placehold.co/300x200')}" 
                                 alt="Thumbnail for ${sanitize(course.title)}" 
                                 loading="lazy"
                                 class="w-full h-48 object-cover rounded-t-xl" />
                            <div class="p-5 space-y-3">
                                <h5 class="text-lg font-semibold text-white truncate">${sanitize(course.title || 'Untitled Course')}</h5>
                                <p class="text-sm text-blue-400 flex items-center gap-2">
                                    <img src="${sanitize(course.categoryIcon)}" alt="${sanitize(course.categoryTitle)} icon" class="category-icon">
                                    ${sanitize(course.categoryTitle || 'N/A')}
                                </p>
                                <p class="text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-clock"></i> Duration: ${sanitize(course.duration || 'N/A')}</p>
                                <p class="text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-users"></i> Enrolled: ${sanitize(course.enrollmentCount || 'N/A')}</p>
                                <p class="text-sm font-semibold px-3 py-1 rounded-full inline-block ${registrationStatus === 'Open' ? 'registration-open' : 'registration-closed'} flex items-center gap-2">
                                    <i class="fas fa-calendar"></i> Registration: ${registrationStatus}
                                </p>
                                ${course.hashTag ? `<span class="badge badge-custom">${sanitize(course.hashTag.value)}</span>` : ''}
                                ${course.categoryMeta ? `
                                    <div class="course-meta bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                                            <div class="flex items-center gap-3 group relative" title="Average Salary Hike">
                                                <i class="fas fa-chart-line text-blue-400 text-lg group-hover:scale-110 transition-transform"></i>
                                                <div class="flex-1">
                                                    <p class="font-semibold">Avg. Salary Hike</p>
                                                    <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(course.categoryMeta.salaryHike || '0%')}"></div>
                                                    </div>
                                                    <span class="text-xs text-gray-400">${sanitize(course.categoryMeta.salaryHike || '0%')}</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3 group relative" title="Highest Salary">
                                                <i class="fas fa-money-bill text-green-400 text-lg group-hover:scale-110 transition-transform"></i>
                                                <div class="flex-1">
                                                    <p class="font-semibold">Highest Salary</p>
                                                    <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                        <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(course.categoryMeta.highestSalary ? '10%' : '0%')}"></div>
                                                    </div>
                                                    <span class="text-xs text-gray-400">${sanitize(course.categoryMeta.highestSalary || '0')}</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3 group relative" title="Career Transitions">
                                                <i class="fas fa-briefcase text-purple-400 text-lg group-hover:scale-110 transition-transform"></i>
                                                <div class="flex-1">
                                                    <p class="font-semibold">Career Transitions</p>
                                                    <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                        <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(course.categoryMeta.careerTransition ? '10%' : '0%')}"></div>
                                                    </div>
                                                    <span class="text-xs text-gray-400">${sanitize(course.categoryMeta.careerTransition || '0')}</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3 group relative" title="Hiring Partners">
                                                <i class="fas fa-building text-yellow-400 text-lg group-hover:scale-110 transition-transform"></i>
                                                <div class="flex-1">
                                                    <p class="font-semibold">Hiring Partners</p>
                                                    <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                        <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(course.categoryMeta.hiringPartner ? '10%' : '0%')}"></div>
                                                    </div>
                                                    <span class="text-xs text-gray-400">${sanitize(course.categoryMeta.hiringPartner || '0')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
                                <a href="https://www.pwskills.com/${sanitize(course.categorySlug)}/${sanitize(course.slug)}" 
                                   class="learn-more-btn mt-3" 
                                   aria-label="Learn more about ${sanitize(course.title || 'this course')}">
                                   <span>Learn More</span>
                                   <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    `;
            fragment.appendChild(courseDiv);
        });
    } else {
        const p = document.createElement('p');
        p.className = 'text-center text-gray-400 py-10';
        p.textContent = `No ${type} courses available.`;
        fragment.appendChild(p);
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}
function renderPaidCourses(categories) {
    const paidCoursesContainer = document.getElementById('paidCoursesContainer').querySelector('div');
    const fragment = document.createDocumentFragment();
    if (categories.length > 0) {
        categories.forEach(category => {
            const cat = categories.find(c => c.title === category.title);
            const categorySection = document.createElement('section');
            categorySection.className = `category-section animate__animated animate__fadeIn mb-12`;
            categorySection.dataset.category = category.slug;
            categorySection.innerHTML = `
                        <h3 class="text-xl font-bold mb-3 text-white flex items-center gap-2">
                            <img src="${sanitize(cat?.icon || 'https://placehold.co/24')}" alt="${sanitize(category.title)} icon" class="category-icon">
                            ${sanitize(category.title)}
                        </h3>
                        ${category.categoryMeta ? `
                            <div class="course-meta bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                                    <div class="flex items-center gap-3 group relative" title="Average Salary Hike">
                                        <i class="fas fa-chart-line text-blue-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Avg. Salary Hike</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.salaryHike || '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.salaryHike || '0%')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Highest Salary">
                                        <i class="fas fa-money-bill text-green-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Highest Salary</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.highestSalary ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.highestSalary || '0')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Career Transitions">
                                        <i class="fas fa-briefcase text-purple-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Career Transitions</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.careerTransition ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.careerTransition || '0')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Hiring Partners">
                                        <i class="fas fa-building text-yellow-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Hiring Partners</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.hiringPartner ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.hiringPartner || '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            ${category.courseDetails.map(course => {
                const registrationStatus = getRegistrationStatus(course.registration.startDate, course.registration.endDate);
                return `
                                    <div class="course-card bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.03] transition duration-300 overflow-hidden p-0">
                                        <img src="${sanitize(course.img || 'https://placehold.co/300x200')}" alt="Thumbnail for ${sanitize(course.title)}" loading="lazy" class="w-full h-48 object-cover rounded-t-xl" />
                                        <div class="p-5 space-y-3">
                                            <h5 class="text-lg font-semibold text-white truncate">${sanitize(course.title || 'Untitled Course')}</h5>
                                            <p class="text-sm text-blue-400 flex items-center gap-2">
                                                <img src="${sanitize(cat?.icon || 'https://placehold.co/24')}" alt="${sanitize(category.title)} icon" class="category-icon">
                                                ${sanitize(category.title)}
                                            </p>
                                            <p class="text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-clock"></i> Duration: ${sanitize(course.duration || 'N/A')}</p>
                                            <p class="text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-users"></i> Enrolled: ${sanitize(course.enrollmentCount || 'N/A')}</p>
                                            <p class="text-sm font-semibold px-3 py-1 rounded-full inline-block ${registrationStatus === 'Open' ? 'registration-open' : 'registration-closed'} flex items-center gap-2">
                                                <i class="fas fa-calendar"></i> Registration: ${registrationStatus}
                                            </p>
                                            ${course.hashTag ? `<span class="badge badge-custom">${sanitize(course.hashTag.value)}</span>` : ''}
                                            <a href="https://www.pwskills.com/${sanitize(cat?.slug || 'course')}/${sanitize(course.slug)}" 
                                               class="learn-more-btn mt-3" 
                                               aria-label="Learn more about ${sanitize(course.title || 'this course')}">
                                               <span>Learn More</span>
                                               <i class="fas fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                `;
            }).join('')}
                        </div>
                    `;
            fragment.appendChild(categorySection);
        });
    } else {
        const p = document.createElement('p');
        p.className = 'text-center text-gray-400 py-10';
        p.textContent = 'No paid courses available.';
        fragment.appendChild(p);
    }
    paidCoursesContainer.innerHTML = '';
    paidCoursesContainer.appendChild(fragment);
}
function renderMentors(mentors) {
    const container = document.getElementById('mentorsContainer').querySelector('div');
    container.innerHTML = '';
    if (!mentors?.length) {
        container.innerHTML = `<p class="text-center text-gray-400 py-10">No mentors available.</p>`;
        return;
    }
    mentors.forEach(mentor => {
        const card = document.createElement('article');
        card.className = 'card animate__animated animate__zoomIn';
        const img = document.createElement('img');
        img.src = sanitize(mentor.img?.link || 'https://placehold.co/100');
        img.alt = `Portrait of ${sanitize(mentor.name || 'mentor')}`;
        img.loading = 'lazy';
        img.className = 'card-img';
        const name = document.createElement('h3');
        name.className = 'mentor-name';
        name.textContent = sanitize(mentor.name || 'Unknown Mentor');
        const designation = document.createElement('p');
        designation.className = 'mentor-designation';
        designation.textContent = sanitize(mentor.instructorDetails?.designation || 'N/A');
        const description = document.createElement('p');
        description.className = 'text-sm text-gray-300 mb-3';
        description.textContent = sanitize(mentor.description || 'No description available');
        card.append(img, name, designation, description);
        function appendCompanies(title, companies) {
            if (!companies?.length) return;
            const label = document.createElement('p');
            label.className = 'font-semibold text-gray-300 mt-4 mb-1';
            label.textContent = title;
            card.appendChild(label);
            const logos = document.createElement('div');
            logos.className = 'company-logos';
            companies.forEach(company => {
                const logo = document.createElement('img');
                logo.src = sanitize(company.companyLogoFileName
                    ? `https://cdn.pwskills.com/assets/uploads/company_logos/${company.companyLogoFileName}`
                    : 'https://placehold.co/40');
                logo.alt = `Logo of ${sanitize(company.company || company.name || '')}`;
                logo.title = sanitize(company.company || company.name || '');
                logo.loading = 'lazy';
                logo.className = 'w-10 h-10 object-contain rounded';
                logos.appendChild(logo);
            });
            card.appendChild(logos);
        }
        appendCompanies('Current Companies:', mentor.instructorDetails?.companies);
        appendCompanies('Past Companies:', mentor.instructorDetails?.pastCompanies);
        const exp = document.createElement('p');
        exp.className = 'text-sm text-gray-300 flex justify-center gap-2 mb-1';
        exp.innerHTML = `<i class="fas fa-briefcase"></i> Work Experience: ${sanitize(mentor.instructorDetails?.workExperience || 'N/A')} years`;
        card.appendChild(exp);
        const teachExp = document.createElement('p');
        teachExp.className = 'text-sm text-gray-300 flex justify-center gap-2 mb-3';
        teachExp.innerHTML = `<i class="fas fa-chalkboard-teacher"></i> Teaching Experience: ${sanitize(mentor.instructorDetails?.teachingExperience || 'N/A')} years`;
        card.appendChild(teachExp);
        if (mentor.social?.linkedin) {
            const linkedin = document.createElement('a');
            linkedin.href = sanitize(mentor.social.linkedin);
            linkedin.target = '_blank';
            linkedin.rel = 'noopener noreferrer';
            linkedin.className = 'social-link';
            linkedin.innerHTML = '<i class="fab fa-linkedin mr-2"></i> LinkedIn';
            linkedin.setAttribute('aria-label', `LinkedIn profile of ${sanitize(mentor.name || 'mentor')}`);
            card.appendChild(linkedin);
        }
        container.appendChild(card);
    });
}
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonialsContainer').querySelector('div');
    container.innerHTML = '';
    if (!testimonials?.length) {
        container.innerHTML = `<p class="text-center text-gray-400 py-10">No testimonials available.</p>`;
        return;
    }
    testimonials.forEach(testimonial => {
        const card = document.createElement('article');
        card.className = 'card animate__animated animate__zoomIn';
        const img = document.createElement('img');
        img.src = sanitize(testimonial.testimonialImage
            ? `https://cdn.pwskills.com/assets/uploads/testimonialImage/${testimonial.testimonialImage}`
            : 'https://placehold.co/80');
        img.alt = `Portrait of ${sanitize(testimonial.name)}`;
        img.loading = 'lazy';
        img.className = 'card-img';
        const quote = document.createElement('p');
        quote.className = 'testimonial-quote';
        quote.textContent = `"${sanitize(testimonial.description || 'No comment provided')}"`;
        const name = document.createElement('p');
        name.className = 'font-semibold mt-2 text-white';
        name.textContent = sanitize(testimonial.name || 'Anonymous');
        const designation = document.createElement('p');
        designation.className = 'text-xs text-gray-400';
        designation.textContent = sanitize(testimonial.designation || 'N/A');
        const company = document.createElement('p');
        company.className = 'text-xs text-gray-500';
        company.textContent = `Company: ${sanitize(testimonial.companyId?.name || 'N/A')}`;
        card.append(img, quote, name, designation, company);
        if (testimonial.courseId) {
            const course = document.createElement('p');
            course.className = 'text-xs text-gray-500';
            course.textContent = `Course: ${sanitize(testimonial.courseId.title || 'N/A')}`;
            card.appendChild(course);
        }
        container.appendChild(card);
    });
}
function renderSuccessStories(stories) {
    const container = document.getElementById('successStoriesContainer').querySelector('.carousel-inner');
    const fragment = document.createDocumentFragment();
    if (!stories?.length) {
        const p = document.createElement('p');
        p.className = 'text-center text-gray-400 py-10';
        p.textContent = 'No success stories available.';
        fragment.appendChild(p);
    } else {
        stories.forEach((story, index) => {
            const card = document.createElement('article');
            card.className = 'carousel-item success-story animate__animated animate__zoomIn max-w-md mx-auto';
            card.setAttribute('role', 'group');
            card.setAttribute('aria-label', `Success story of ${sanitize(story.studentName)}`);
            card.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            const img = document.createElement('img');
            img.src = sanitize(story.studentImage || 'https://placehold.co/100');
            img.alt = `Photo of ${sanitize(story.studentName)}`;
            img.loading = 'lazy';
            img.className = 'w-24 h-24 rounded-full object-cover border-4 border-blue-400 mx-auto';
            const name = document.createElement('h3');
            name.className = 'text-xl font-semibold text-white mt-4';
            name.textContent = sanitize(story.studentName);
            const designation = document.createElement('p');
            designation.className = 'text-sm text-blue-400 font-medium';
            designation.textContent = sanitize(story.studentDesignation || 'Professional');
            const comment = document.createElement('blockquote');
            comment.className = 'italic text-gray-300 mt-2';
            comment.textContent = `"${sanitize(story.comment)}"`;
            const company = document.createElement('footer');
            company.className = 'text-sm text-gray-400 mt-4';
            company.textContent = `Placed at: ${sanitize(story.toCompanyId?.name || 'Company not specified')}`;
            if (story.toCompanyId?.description) {
                const companyDesc = document.createElement('p');
                companyDesc.className = 'text-xs text-gray-500 mt-1';
                companyDesc.textContent = sanitize(story.toCompanyId.description);
                company.appendChild(companyDesc);
            }
            card.append(img, name, designation, comment, company);
            fragment.appendChild(card);
        });
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}
function renderCompanies(companiesLogos) {
    const container = document.getElementById('companiesLogosContainer').querySelector('div');
    const fragment = document.createDocumentFragment();
    if (companiesLogos.length > 0) {
        companiesLogos.forEach(company => {
            const companyDiv = document.createElement('div');
            companyDiv.className = 'flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeIn';
            companyDiv.innerHTML = `
                        <img 
                            src="${sanitize(company.companyLogoFileName
                ? `https://cdn.pwskills.com/assets/uploads/company_logos/${company.companyLogoFileName}`
                : 'https://placehold.co/100')}" 
                            alt="Logo of ${sanitize(company.name)}" 
                            loading="lazy"
                            class="w-20 h-20 object-contain mb-2"
                        >
                        <p class="text-center text-gray-300 text-sm font-medium">${sanitize(company.name)}</p>
                    `;
            fragment.appendChild(companyDiv);
        });
    } else {
        const p = document.createElement('p');
        p.className = 'text-center text-gray-400 py-6 italic';
        p.textContent = 'No hiring partners available.';
        fragment.appendChild(p);
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}
function filterContent(categoryFilter, searchTerms = []) {
    const freeCoursesContainer = document.getElementById('freeCoursesContainer').querySelector('div');
    const paidCoursesContainer = document.getElementById('paidCoursesContainer').querySelector('div');
    const mentorsContainer = document.getElementById('mentorsContainer').querySelector('div');
    const testimonialsContainer = document.getElementById('testimonialsContainer').querySelector('div');
    let filteredCourses = allCourses;
    if (categoryFilter !== 'all') {
        filteredCourses = allCourses.filter(course => course.categoryId === categoryFilter);
    }
    if (searchTerms.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
            searchTerms.every(term =>
                course.title.toLowerCase().includes(term) ||
                (course.categoryTitle || '').toLowerCase().includes(term)
            )
        );
    }
    let filteredMentors = mentors;
    if (searchTerms.length > 0) {
        filteredMentors = mentors.filter(mentor =>
            searchTerms.every(term =>
                mentor.name.toLowerCase().includes(term) ||
                (mentor.description || '').toLowerCase().includes(term)
            )
        );
    }
    let filteredTestimonials = testimonials;
    if (searchTerms.length > 0) {
        filteredTestimonials = testimonials.filter(testimonial =>
            searchTerms.every(term =>
                testimonial.name.toLowerCase().includes(term) ||
                (testimonial.description || '').toLowerCase().includes(term) ||
                (testimonial.courseId?.title || '').toLowerCase().includes(term)
            )
        );
    }
    const freeCourses = filteredCourses.filter(course => course.type === 'free');
    const paidCourses = filteredCourses.filter(course => course.type === 'paid');
    renderCourses(freeCourses, freeCoursesContainer, 'free');
    paidCoursesContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    if (categoryFilter === 'all' && searchTerms.length === 0) {
        renderPaidCourses(paidCategories);
    } else {
        const groupedByCategory = paidCourses.reduce((acc, course) => {
            acc[course.categoryTitle] = acc[course.categoryTitle] || [];
            acc[course.categoryTitle].push(course);
            return acc;
        }, {});
        Object.entries(groupedByCategory).forEach(([categoryTitle, courses]) => {
            const category = paidCategories.find(cat => cat.title === categoryTitle);
            const cat = categories.find(c => c.title === categoryTitle);
            const categorySection = document.createElement('div');
            categorySection.className = `category-section category-${sanitize(category?.slug)} animate__animated animate__fadeIn`;
            categorySection.dataset.category = category?.slug;
            categorySection.innerHTML = `
                        <h3 class="category-title text-xl font-bold mb-3 text-white flex items-center gap-2">
                            <img src="${sanitize(cat?.icon || 'https://placehold.co/24')}" alt="${sanitize(categoryTitle)} icon" class="category-icon">
                            ${sanitize(categoryTitle)}
                        </h3>
                        ${category?.categoryMeta ? `
                            <div class="course-meta bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                                    <div class="flex items-center gap-3 group relative" title="Average Salary Hike">
                                        <i class="fas fa-chart-line text-blue-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Avg. Salary Hike</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.salaryHike || '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.salaryHike || '0%')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Highest Salary">
                                        <i class="fas fa-money-bill text-green-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Highest Salary</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.highestSalary ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.highestSalary || '0')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Career Transitions">
                                        <i class="fas fa-briefcase text-purple-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Career Transitions</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.careerTransition ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.careerTransition || '0')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 group relative" title="Hiring Partners">
                                        <i class="fas fa-building text-yellow-400 text-lg group-hover:scale-110 transition-transform"></i>
                                        <div class="flex-1">
                                            <p class="font-semibold">Hiring Partners</p>
                                            <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" style="width: ${sanitize(category.categoryMeta.hiringPartner ? '10%' : '0%')}"></div>
                                            </div>
                                            <span class="text-xs text-gray-400">${sanitize(category.categoryMeta.hiringPartner || '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            ${courses.map(course => {
                const registrationStatus = getRegistrationStatus(course.registration.startDate, course.registration.endDate);
                return `
                                    <div class="course-card bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.03] transition duration-300 overflow-hidden">
                                        <img src="${sanitize(course.img || 'https://placehold.co/300x200')}" class="course-img card-img-top" alt="Thumbnail for ${sanitize(course.title)}" loading="lazy">
                                        <div class="p-5 space-y-3">
                                            <h5 class="card-title text-lg font-semibold text-white truncate">${sanitize(course.title || 'Untitled Course')}</h5>
                                            <p class="card-text text-sm text-blue-400 flex items-center gap-2">
                                                <img src="${sanitize(course.categoryIcon)}" alt="${sanitize(categoryTitle)} icon" class="category-icon">
                                                ${sanitize(categoryTitle)}
                                            </p>
                                            <p class="card-text text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-clock"></i> Duration: ${sanitize(course.duration || 'N/A')}</p>
                                            <p class="card-text text-sm text-gray-300 flex items-center gap-2"><i class="fas fa-users"></i> Enrolled: ${sanitize(course.enrollmentCount || 'N/A')}</p>
                                            <p class="card-text registration-status registration-${registrationStatus.toLowerCase()} text-sm font-semibold px-3 py-1 rounded-full inline-block flex items-center gap-2">
                                                <i class="fas fa-calendar"></i> Registration: ${registrationStatus}
                                            </p>
                                            ${course.hashTag ? `<span class="badge badge-custom">${sanitize(course.hashTag.value)}</span>` : ''}
                                            <a href="https://www.pwskills.com/${sanitize(course.categorySlug)}/${sanitize(course.slug)}" 
                                               class="learn-more-btn mt-3" 
                                               aria-label="Learn more about ${sanitize(course.title || 'this course')}">
                                               <span>Learn More</span>
                                               <i class="fas fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                `;
            }).join('')}
                        </div>
                    `;
            fragment.appendChild(categorySection);
        });
        if (Object.keys(groupedByCategory).length === 0) {
            const p = document.createElement('p');
            p.className = 'text-center';
            p.textContent = 'No paid courses match your search.';
            fragment.appendChild(p);
        }
        paidCoursesContainer.appendChild(fragment);
    }
}
document.addEventListener('DOMContentLoaded', fetchData);
// =============================================
// INTERSECTION OBSERVER - REVEAL ANIMATIONS
// =============================================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// =============================================
// NAVIGATION
// =============================================

const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

navToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav__menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// =============================================
// SMOOTH SCROLL
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  });
});

// =============================================
// CALENDAR
// =============================================

const GOOGLE_CALENDAR_ID = 'YOUR_GOOGLE_CALENDAR_ID@group.calendar.google.com';
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.events = [];
    
    this.monthEl = document.getElementById('calMonth');
    this.daysEl = document.getElementById('calDays');
    this.eventsListEl = document.getElementById('calEventsList');
    this.prevBtn = document.getElementById('calPrev');
    this.nextBtn = document.getElementById('calNext');
    
    if (!this.monthEl || !this.daysEl) return;
    
    this.init();
  }
  
  init() {
    this.prevBtn?.addEventListener('click', () => this.changeMonth(-1));
    this.nextBtn?.addEventListener('click', () => this.changeMonth(1));
    
    this.render();
    this.fetchEvents();
  }
  
  changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.render();
    this.fetchEvents();
  }
  
  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    this.monthEl.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    let html = '';
    
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="calendar__day calendar__day--empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = this.events.some(e => e.date === dateStr);
      const isToday = isCurrentMonth && today.getDate() === day;
      const isSelected = this.selectedDate === dateStr;
      
      let classes = 'calendar__day';
      if (isToday) classes += ' calendar__day--today';
      if (hasEvent) classes += ' calendar__day--has-event';
      if (isSelected) classes += ' calendar__day--selected';
      
      html += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }
    
    this.daysEl.innerHTML = html;
    
    this.daysEl.querySelectorAll('.calendar__day:not(.calendar__day--empty)').forEach(day => {
      day.addEventListener('click', () => this.selectDate(day.dataset.date));
    });
  }
  
  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.render();
    this.showEvents(dateStr);
  }
  
  showEvents(dateStr) {
    const dayEvents = this.events.filter(e => e.date === dateStr);
    
    if (dayEvents.length === 0) {
      this.eventsListEl.innerHTML = '<p class="calendar__no-events">No events on this date</p>';
      return;
    }
    
    const html = dayEvents.map(event => `
      <div class="calendar__event">
        <span class="calendar__event-time">${event.time || 'All day'}</span>
        <span class="calendar__event-title">${event.title}</span>
      </div>
    `).join('');
    
    this.eventsListEl.innerHTML = html;
  }
  
  async fetchEvents() {
    if (GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
      this.events = this.getSampleEvents();
      this.render();
      return;
    }
    
    const timeMin = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).toISOString();
    const timeMax = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).toISOString();
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?` +
        `key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
      );
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      
      this.events = (data.items || []).map(item => ({
        id: item.id,
        title: item.summary,
        date: item.start.date || item.start.dateTime?.split('T')[0],
        time: item.start.dateTime ? new Date(item.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        description: item.description
      }));
      
      this.render();
    } catch (error) {
      console.warn('Could not fetch Google Calendar events:', error);
      this.events = this.getSampleEvents();
      this.render();
    }
  }
  
  getSampleEvents() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    return [
      {
        id: '1',
        title: 'Podcast Recording',
        date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
        time: '2:00 PM'
      },
      {
        id: '2',
        title: 'Community Meetup',
        date: `${year}-${String(month + 1).padStart(2, '0')}-22`,
        time: '6:00 PM'
      },
      {
        id: '3',
        title: 'Scholarship Gala',
        date: `${year}-${String(month + 1).padStart(2, '0')}-28`,
        time: '7:00 PM'
      }
    ];
  }
}

new Calendar();

// =============================================
// SUBSCRIBE FORM - Google Apps Script Integration
// =============================================

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

const subscribeForm = document.getElementById('subscribeForm');

subscribeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(subscribeForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    timestamp: new Date().toISOString()
  };
  
  const submitBtn = subscribeForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<span>Subscribing...</span>';
  submitBtn.disabled = true;
  
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitBtn.innerHTML = '<span>Thank you!</span>';
    subscribeForm.reset();
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
    
    console.log('Demo mode: Form data would be sent:', data);
    return;
  }
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    submitBtn.innerHTML = '<span>Thank you!</span>';
    subscribeForm.reset();
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
    
  } catch (error) {
    console.error('Subscription error:', error);
    submitBtn.innerHTML = '<span>Error - Try Again</span>';
    submitBtn.disabled = false;
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
    }, 3000);
  }
});

// =============================================
// YOUTUBE VIDEO EMBEDS
// =============================================

document.querySelectorAll('.podcast-card__placeholder, .podcast-card__thumbnail').forEach(element => {
  element.addEventListener('click', function() {
    const videoId = this.dataset.videoId;
    
    if (videoId && !videoId.startsWith('PLACEHOLDER')) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      
      this.parentElement.innerHTML = '';
      this.parentElement.appendChild(iframe);
    }
  });
});

// =============================================
// ADD TO CALENDAR LINK
// =============================================

document.getElementById('addToCalendar')?.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (GOOGLE_CALENDAR_ID !== 'YOUR_GOOGLE_CALENDAR_ID@group.calendar.google.com') {
    window.open(
      `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(GOOGLE_CALENDAR_ID)}`,
      '_blank'
    );
  } else {
    alert('Calendar integration coming soon! Check back later to add our events to your calendar.');
  }
});

// =============================================
// GALLERY CAROUSEL
// =============================================

class GalleryCarousel {
  constructor() {
    this.track = document.getElementById('galleryTrack');
    this.dotsContainer = document.getElementById('galleryDots');
    this.prevBtn = document.getElementById('galleryPrev');
    this.nextBtn = document.getElementById('galleryNext');
    
    if (!this.track) return;
    
    this.slides = this.track.querySelectorAll('.gallery__slide');
    this.dots = this.dotsContainer.querySelectorAll('.gallery__dot');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;
    
    this.init();
  }
  
  init() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });
    
    this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    
    this.setupTouchEvents();
    this.setupKeyboardNav();
    this.startAutoPlay();
  }
  
  setupTouchEvents() {
    let startX = 0;
    let endX = 0;
    const threshold = 50;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      this.stopAutoPlay();
    }, { passive: true });
    
    this.track.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });
    
    this.track.addEventListener('touchend', () => {
      const diff = startX - endX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      this.startAutoPlay();
    });
  }
  
  setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      const gallerySection = document.getElementById('gallery');
      const rect = gallerySection?.getBoundingClientRect();
      
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') {
          this.prev();
        } else if (e.key === 'ArrowRight') {
          this.next();
        }
      }
    });
  }
  
  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateDots();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }
  
  next() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goTo(nextIndex);
  }
  
  prev() {
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goTo(prevIndex);
  }
  
  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('gallery__dot--active', index === this.currentIndex);
    });
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

new GalleryCarousel();

// =============================================
// PARALLAX EFFECT ON HERO
// =============================================

const heroVisual = document.querySelector('.hero__visual');

if (heroVisual) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
}

// =============================================
// PRELOAD CRITICAL RESOURCES
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});

// Neo-Brutalist Comic Live Engine for Deeptanil Sinha
// Fetches real-time live metrics directly from GitHub API without external dependencies

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  fetchGitHubMetrics();
  initEmailCopy();
});

// Live Terminal Clock
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utcStr = now.toISOString().substring(11, 19) + ' UTC';
    clockEl.textContent = utcStr;
  }
  update();
  setInterval(update, 1000);
}

// Live GitHub Data Fetcher
async function fetchGitHubMetrics() {
  const username = 'Deeptanil';
  
  const reposCountEl = document.getElementById('live-repos-count');
  const followersCountEl = document.getElementById('live-followers-count');
  const starsCountEl = document.getElementById('live-stars-count');
  const latestActivityEl = document.getElementById('live-latest-activity');
  const liveReposListEl = document.getElementById('live-repos-list');

  try {
    // Fetch User Profile Data
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.ok) {
      const userData = await userRes.json();
      if (reposCountEl) reposCountEl.textContent = userData.public_repos || '24';
      if (followersCountEl) followersCountEl.textContent = userData.followers || '18';
    }

    // Fetch Public Repos for Stars and Activity
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      
      let totalStars = 0;
      repos.forEach(repo => {
        totalStars += (repo.stargazers_count || 0);
      });
      if (starsCountEl) starsCountEl.textContent = totalStars;

      if (repos.length > 0 && latestActivityEl) {
        const latest = repos[0];
        const updatedDate = new Date(latest.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        latestActivityEl.innerHTML = `Active on <a href="${latest.html_url}" target="_blank" style="color: var(--comic-yellow); text-decoration: underline; font-weight: 700;">${latest.name}</a> (${updatedDate})`;
      }

      // Populate Live Repos Grid if container exists
      if (liveReposListEl && repos.length > 0) {
        liveReposListEl.innerHTML = repos.slice(0, 4).map(repo => `
          <div class="card" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="badge badge-cyan">${repo.language || 'Code'}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--comic-yellow); font-weight: 700;">
                ★ ${repo.stargazers_count || 0}
              </span>
            </div>
            <a href="${repo.html_url}" target="_blank" style="font-family: var(--font-display); font-size: 1.1rem; color: #FFFFFF; text-decoration: none; display: block; margin-bottom: 0.4rem;">
              ${repo.name}
            </a>
            <p style="font-family: var(--font-heading); font-size: 0.85rem; color: #94A3B8; margin-bottom: 0.75rem; min-height: 2.4rem;">
              ${repo.description || 'Open source engineering project.'}
            </p>
            <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-accent" style="width: 100%;">
              Inspect Repository
            </a>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('GitHub API rate limited or offline; fallback values displayed.', err);
    if (reposCountEl && reposCountEl.textContent === '...') reposCountEl.textContent = '24';
    if (followersCountEl && followersCountEl.textContent === '...') followersCountEl.textContent = '18';
    if (starsCountEl && starsCountEl.textContent === '...') starsCountEl.textContent = '12';
    if (latestActivityEl) latestActivityEl.textContent = 'Active on FileGuard & Headless Medusa v2';
  }
}

// Copy Email with Neo-Brutalist Toast
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('copy-toast');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'deeptanilsinha27@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (!toast) return;
        toast.style.display = 'block';
        toast.textContent = 'COPIED: deeptanilsinha27@gmail.com';
        setTimeout(() => {
          toast.style.display = 'none';
        }, 2800);
      });
    });
  });
}

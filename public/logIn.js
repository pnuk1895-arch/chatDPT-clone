  // ----- DOM refs -----
    const form = document.getElementById('loginForm');
    const combinedInput = document.getElementById('combinedInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const feedback = document.getElementById('feedback');

    // ----- helper: set feedback -----
    function setFeedback(msg, type = '') {
      feedback.textContent = msg;
      feedback.className = 'feedback ' + type;
    }

    // ----- handle login (with validation & dynamic feedback) -----
    function handleLogin(e) {
      e.preventDefault();
      
      // reset states
      combinedInput.classList.remove('success', 'error');
      passwordInput.classList.remove('success', 'error');
      loginBtn.classList.remove('loading');
      setFeedback('', '');

      const identifier = combinedInput.value.trim();
      const password = passwordInput.value.trim();

      // validation
      if (!identifier && !password) {
        combinedInput.classList.add('error');
        passwordInput.classList.add('error');
        setFeedback('⛔ please enter your credentials', 'error');
        return;
      }

      if (!identifier) {
        combinedInput.classList.add('error');
        setFeedback('⛔ please enter username, phone, or email', 'error');
        return;
      }

      if (!password) {
        passwordInput.classList.add('error');
        setFeedback('⛔ please enter your password', 'error');
        return;
      }

      // simulate loading
      loginBtn.classList.add('loading');
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> logging in...';

      // simulate async login (demo)
      setTimeout(() => {
        // success feedback
        combinedInput.classList.add('success');
        passwordInput.classList.add('success');
        setFeedback('✅ welcome back! (demo)', 'success');
        
        loginBtn.classList.remove('loading');
        loginBtn.innerHTML = '<i class="fas fa-arrow-right-to-bracket"></i> log in';
        
        // reset after 2.5s
        setTimeout(() => {
          combinedInput.classList.remove('success');
          passwordInput.classList.remove('success');
          setFeedback('', '');
        }, 2500);
      }, 1200);
    }

    // ----- handle Google (demo) -----
    function handleGoogle() {
      feedback.className = 'feedback';
      feedback.textContent = '🌐 redirecting to Google...';
      feedback.style.color = '#8a8a8a';
      
      setTimeout(() => {
        alert('continue with Google · demo');
        feedback.textContent = '';
      }, 400);
    }

    // ----- handle sign in (demo) -----
    function handleSignIn(e) {
      e.preventDefault();
      feedback.className = 'feedback';
      feedback.textContent = '📝 redirecting to sign up...';
      feedback.style.color = '#8a8a8a';
      
      setTimeout(() => {
        alert('sign up / sign in demo');
        feedback.textContent = '';
      }, 400);
    }

    // ----- live interaction: remove error states while typing -----
    combinedInput.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        setFeedback('', '');
      }
      if (this.classList.contains('success')) {
        this.classList.remove('success');
      }
    });

    passwordInput.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        setFeedback('', '');
      }
      if (this.classList.contains('success')) {
        this.classList.remove('success');
      }
    });

    // ----- focus hints -----
    combinedInput.addEventListener('focus', function() {
      if (!this.value.trim()) {
        setFeedback('💡 enter username, phone, or email', '');
      }
    });

    passwordInput.addEventListener('focus', function() {
      if (!this.value.trim()) {
        setFeedback('🔒 enter your password', '');
      }
    });

    combinedInput.addEventListener('blur', function() {
      if (!this.value.trim() && !passwordInput.value.trim()) {
        setFeedback('', '');
      }
    });

    passwordInput.addEventListener('blur', function() {
      if (!this.value.trim() && !combinedInput.value.trim()) {
        setFeedback('', '');
      }
    });

    console.log('✨ login ready — combined + password, hover & JS active');
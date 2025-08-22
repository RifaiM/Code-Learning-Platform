// Initialize task preview
    const taskEditor = document.getElementById('task-code');
    const taskPreview = document.getElementById('task-preview');
    function renderTask(){ taskPreview.srcdoc = taskEditor.value; }
    taskEditor.addEventListener('input', renderTask);
    renderTask();

    function showHint(){
      alert('Hint: Use <h1> for the heading and <p> for the paragraph. Make sure your heading text matches "My First Webpage".');
    }
    function checkAnswer(){
      const code = taskEditor.value.toLowerCase();
      const hasOpeningH1 = code.includes('<h1>');
      const hasClosingH1 = code.includes('</h1>');
      const hasOpeningP = code.includes('<p>');
      const hasClosingP = code.includes('</p>');
      const hasCorrectTitle = code.match(/<h1>\s*my first webpage\s*<\/h1>/);

      let errorMessages = [];
      if (!hasOpeningH1) errorMessages.push('Missing opening <h1> tag.');
      if (!hasClosingH1) errorMessages.push('Missing closing </h1> tag.');
      if (!hasOpeningP) errorMessages.push('Missing opening <p> tag.');
      if (!hasClosingP) errorMessages.push('Missing closing </p> tag.');
      if (!hasCorrectTitle) errorMessages.push('The heading must contain exactly "My First Webpage" (case insensitive).');

      const fb = document.getElementById('feedback');
      if (errorMessages.length === 0) {
        fb.textContent = '✅ Correct! You can move to the next lesson.';
        fb.style.color = 'green';
        localStorage.setItem('partB_lesson1_complete','true');
      } else {
        fb.textContent = '❌ Errors: ' + errorMessages.join(' ');
        fb.style.color = '#b00020';

        const missingClosings = errorMessages.filter(msg => msg.includes('closing'));
        if (missingClosings.length > 0) {
          alert('Please add the closing tags: ' + missingClosings.join(' and '));
        }
      }
    }
  

(function(){
  var nextBtn = document.getElementById('nextLessonBtn');
  function enableNext(){
    if(!nextBtn) return;
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
  }
  function checkFeedback(){
    var fb = document.getElementById('feedback');
    if(fb && /correct/i.test(fb.textContent || '')){
      enableNext();
    }
  }
  // Hook into Check Answer button
  var checkBtn = Array.prototype.find.call(document.querySelectorAll('button'), function(b){
    return /check\s*answer/i.test(b.textContent || '');
  });
  if (checkBtn){
    checkBtn.addEventListener('click', function(){
      setTimeout(checkFeedback, 100);
    });
  }
  // Click to go to lesson2.html
  if(nextBtn){
    nextBtn.addEventListener('click', function(){
      if(!this.disabled){
        window.location.href = '../lesson2/lesson2.html';
      }
    });
  }
})();
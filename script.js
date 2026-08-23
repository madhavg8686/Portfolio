  const lines = [
    { html: '<span class="prompt">$</span> aws cloudformation deploy \\', delay: 0 },
    { html: '  --template-file infra.yaml --stack-name lambda-safe-deploy', delay: 400 },
    { html: 'Waiting for changeset to be created..', delay: 900 },
    { html: '<span class="ok">Changeset created successfully</span>', delay: 1500 },
    { html: 'Waiting for stack create/update to complete', delay: 2050 },
    { html: '<span class="ok">Successfully created/updated stack</span> - lambda-safe-deploy', delay: 2700 },
    { html: '', delay: 3050 },
    { html: '<span class="prompt">$</span> aws lambda invoke --function-name canary-release out.json', delay: 3300 },
    { html: '{', delay: 3850 },
    { html: '  <span class="key">"StatusCode"</span>: 200,', delay: 4050 },
    { html: '  <span class="key">"ExecutedVersion"</span>: <span class="warn">"$LATEST"</span>', delay: 4250 },
    { html: '}', delay: 4450 },
    { html: '', delay: 4700 },
    { html: '<span class="prompt">$</span> aws cloudwatch describe-alarms --alarm-names error-rate', delay: 4950 },
    { html: 'StateValue: <span class="ok">OK</span>&nbsp;&nbsp;region: ap-south-1&nbsp;&nbsp;uptime: 99.98%<span class="cursor"></span>', delay: 5500 },
  ];

  const body = document.getElementById('termBody');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    body.innerHTML = lines.map(l => l.html).join('\n');
  } else {
    lines.forEach(l => {
      const div = document.createElement('div');
      div.className = 'line';
      div.style.animationDelay = (l.delay/1000) + 's';
      div.innerHTML = l.html || '&nbsp;';
      body.appendChild(div);
    });
  }

const form = document.getElementById('vote-form');

//Form Submit

form.addEventListener('submit', (e) => {

  const choice = document.querySelector('input[name=os]:checked').value;
  const data = { os: choice };

  fetch('https://safe-sands-25216.herokuapp.com/poll', {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
    .then(data => {
      const voteCount = data.votes;

    })
    .catch(err => console.log(err));
  e.preventDefault();
});


fetch('https://safe-sands-25216.herokuapp.com/poll', {
  method: 'GET'
})
  .then(resp => resp.json())
  .then(datas => {
    const votes = datas.votes;
    let totalVotes = votes.length;
    const voteCounts = votes.reduce((acc, vote) =>
      ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {
        Windows: 0,
        MacOS: 0,
        Linux: 0,
        Other: 0
      });
    console.log('checkpoint2');
    // if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
    //   voteCounts.Windows = 0;
    //   voteCounts.MacOS = 0;
    //   voteCounts.Linux = 0;
    //   voteCounts.Other = 0;
    // }
    let dataPoints = [
      { label: 'Windows', y: voteCounts.Windows },
      { label: 'MacOS', y: voteCounts.MacOS },
      { label: 'Linux', y: voteCounts.Linux },
      { label: 'Other', y: voteCounts.Other }
    ];

    //const chartContainer = document.querySelector('#chartContainer');

    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: `Total Votes :${totalVotes}`
      },
      data: [{
        type: 'column',
        indexLabelFontColor: '#660bb1',
        indexLabelPlacement: 'outside',
        dataPoints: dataPoints
      }]
    });
    chart.render();

    Pusher.logToConsole = false;

    var pusher = new Pusher('cad89f96f54a1d7c11fc', {
      cluster: 'us2',
      encrypted: true
    });
    console.log('checkpoint3');

    var channel = pusher.subscribe('os-poll');
    channel.bind('os-vote', function (data) {
      dataPoints = dataPoints.map(x => {
        if (x.label == data.os) {
          x.y += data.points;
          return x;
        } else {
          return x;
        }
      });
      console.log(chart);
      totalVotes = data.votes.length;
      chart.options.title.text = `Total Votes : ${totalVotes}`
      chart.render();
    });

  })
  .catch(err => console.log(err));
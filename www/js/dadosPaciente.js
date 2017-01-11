var canvas = document.getElementById('myChart');
var data = {
  labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  datasets: [
    [
      label: "Dados de número de passos",
      backgroundColor: "rgba:(255, 99, 132, 0.2)",
      borderColor: "rgba:(255, 99, 132, 1)",
      borderWidth: 5,
      hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
      hoverBorderColor: "rgba:(255, 99, 132, 1)",
      data: [10, 20, 30, 40, 50], // AJUSTAR PARA ALTERAÇÃO DINÂMICA COM DB.
    ]
  ]
};

var myBarChart = Chart.Bar(canvas,{
  data:data
});


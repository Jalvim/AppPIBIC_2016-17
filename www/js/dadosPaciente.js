function dataHealth1{
  $.get("https://pibicfitbit.herokuapp.com/api/paciente/health", function(data1, status1){
    alert("Data: " + data1 + "\nStatus: " + status1);
  }); // TODO VER COMO OS REQUESTS DA API VÃO FUNCIONAR.
}

function dataHealth2{
  $.get("https://pibicfitbit.herokuapp.com/api/paciente/health", function(data2, status2){
    alert("Data: " + data2 + "\nStatus: " + status2);
  }); // TODO VER COMO OS REQUESTS DA API VÃO FUNCIONAR.
}

function dataHealth3{
  $.get("https://pibicfitbit.herokuapp.com/api/paciente/health", function(data3, status3){
    alert("Data: " + data3 + "\nStatus: " + status3);
  }); // TODO VER COMO OS REQUESTS DA API VÃO FUNCIONAR.
}

function dataHealth4{
  $.get("https://pibicfitbit.herokuapp.com/api/paciente/health", function(data4, status4){
    alert("Data: " + data4 + "\nStatus: " + status4);
  }); // TODO VER COMO OS REQUESTS DA API VÃO FUNCIONAR.
}

var canvas1 = document.getElementById('myChart1');

var canvas2 = document.getElementById('myChart2');

var canvas3 = document.getElementById('myChart3');

var canvas4 = document.getElementById('myChart4');

var data1 = {
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

var data2 = {
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

var data3 = {
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

var data4 = {
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

var myBarChart1 = Chart.Bar(canvas1,{
  data1:data1
});

var myBarChart2 = Chart.Bar(canvas2,{
  data2:data2
});

var myLineChart1 = Chart.Line(canvas3,{
  data3:data3
});

var myBarChart1 = Chart.Line(canvas4,{
  data4:data4
});


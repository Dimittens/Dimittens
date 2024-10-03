document.addEventListener('DOMContentLoaded',function() {
    const monthsBr = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
    function GetDaysCalendar(mes,ano){
        document.getElementById('mes').innerHtml = monthsBR[mes];
    }
    GetDaysCalendar(2,2001);
})
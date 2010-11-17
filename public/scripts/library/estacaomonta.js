$(document).ready(function() {

	makeDateField("#dt_inicio, #dt_fim", false, false);
	//, {beforeShow: customRange});

	$("#dt_inicio, #dt_fim").datepicker("option", "beforeShow",
		function(input)
		{
			return {
				minDate: (input.id == "dt_inicio" ? new Date(2008, 12 - 1, 1) : null),
				minDate: (input.id == "dt_fim" ? $("#dt_inicio").datepicker("getDate") : null),
				maxDate: (input.id == "dt_inicio" ? $("#dt_fim").datepicker("getDate") : null)
			};
		}
	);

});

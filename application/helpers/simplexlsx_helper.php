<?php

	function xlsx_date($date) {
		return date('Y-m-d', ($date - 25569) * 86400);
	}
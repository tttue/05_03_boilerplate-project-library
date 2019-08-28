function checkStringNotBlank(data, name = "Param") {
	if (!data || /^\s+$/.test(data)) {
		return name + " must be not blank";
	}
	return null;
}

function checkNumber(data, name = "Param", isNotBlank = false) {
	if (isNotBlank){
		var result = checkStringNotBlank(data,name);
		if (result){
			return result;
		}
	}
	let checkNumberS = /^[0-9]*$/;

	if (!data) {
		return null;
	} else if (!checkNumberS.test(data)) {
		return name + ": wrong number format";
	}
	return null;
}

function checkDate(data, name = "Param", isNotBlank = false) {
	if (isNotBlank){
		var result = checkStringNotBlank(data,name);
		if (result){
			return result;
		}
	}

	let checkDateS = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

	if (!data) {
		return null;
	} else if (!checkDateS.test(data)) {
		return name + ": wrong date format";
	} else if (isNaN((new Date(data)).getTime())) {
		return name + ": Invalid Date";
	}

	return null;
}

function checkId(id, name="Param", isNotBlank = false){
	if (isNotBlank){
		var result = checkStringNotBlank(id,name);
		if (result){
			return result;
		}
	}
	var testId = /^[0-9a-f]{24}$/
	if (!id) {
		return null;
	} else if (!testId.test(id)) {
		result = "_id=" + id + " is not valid";
		return result;
	}

	return null;
}

exports.checkStringNotBlank = checkStringNotBlank;
exports.checkDate = checkDate;
exports.checkNumber = checkNumber;
exports.checkId = checkId;
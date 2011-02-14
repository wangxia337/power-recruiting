jQuery.fn.exists = function(){return jQuery(this).length>0;}


var Candidate = $.Class.create({
initialize: function(obj) {
	//1	马亚娜	F	Dev	Master	西安交通大学	信息工程	13772148940	12	11	26	47
	this.id = obj[0] - 0;
	this.name = obj[1];
	this.gender = obj[2];
	this.college = obj[3];
	this.department = obj[4];
	this.phone = obj[5];
	this.logic_correct = obj[6]  - 0;
	this.logic_answered = obj[7]  - 0;
	this.w_correct = obj[8] - 0;
	this.w_answered = obj[9]  - 0;
	if (obj[10] == null) {
		day = (this.id / 50) + 1
		group = (((this.id -1) / 10) + 1) % 5
		this.group = "G-" + Math.floor(day) + "-" + Math.floor(group);
	} else {
		this.group = obj[10]
	}

	this.grade = obj[11] == null? 'D' : obj[11];
},
gender_str:function() {
	return this.is_female() ? "Female" : "Male"
},
is_female:function() {
	return this.gender == 'F' || this.gender == '女';
},
display:function() {
	var	group = this.findExistingGroup()
	this.attachToGroup(group, this.getGrade())
},
updateGrade:function(grade) {
	var all_grade = ["gradeA","gradeB","gradeC", "gradeD", "grade1","grade2-A","grade2-B","grade2-C","grade3"]
	var candidate = this;
	$(all_grade).each(function(index, elem) {
		if (grade.indexOf(elem) > -1) {
			candidate.grade = elem.replace("grade", "")
		}		
	})
},
_is_single_group : function() {
	var all_grade = ["A","B", "C", "D"];
	var is_single_group = false;
	var candidate = this;
	$(all_grade).each(function(index, elem) {
		if (candidate.grade == elem) {
			is_single_group = true;
		}
	})
	return is_single_group;
},
render:function() {
	var group;
	if (this._is_single_group()) {
		group = $("#" + this.group + "-panel");
	} else {
		group = $("#all-groups");
	}
	var css = "male";
	if (this.is_female()) {
		css = "female"
	}
	var text = "<div id=" + this.id + " class='candidate  ui-widget-content ui-draggable " + css +"'><a href='index.html?id=" + this.id + "'>" + this.name + "\n" + this.logic_correct + " " + this.w_correct + "</a></div>";
	var obj = $("#" + group.attr('id') + " .grade" + this.grade);
	obj.append(text)
},
findExistingGroup:function() {
	return $("#" + this.group);
},
toCSV:function() {
	return this.toString()
},
export_as: function() {
	if (this._is_single_group()) {
		return ""
	}
	var str = "" + this.name + "\t"
	+ this.gender+ "\t"
	+ this.college + "\t"
	+ this.department + "\t"
	+ this.phone + "\t"
	+ this.logic_correct + "\t"
	+ this.logic_answered + "\t"
	+ this.w_correct  + "\t"
	+ this.w_answered + "\t"
	+ this.grade; + "\t"
	return str;
},
toString: function() {
	var str = "" + this.id + "\t"
	+ this.name + "\t"
	+ this.gender+ "\t"
	+ this.college + "\t"
	+ this.department + "\t"
	+ this.phone + "\t"
	+ this.logic_correct + "\t"
	+ this.logic_answered + "\t"
	+ this.w_correct  + "\t"
	+ this.w_answered + "\t"
	+ this.group + "\t"
	+ this.grade; + "\t"
	return str;
}
});
function getLocalStorage() {
  return window['localStorage'];
}

var Candidates = $.Class.create({
	initialize: function(group_size) {
		this._candidates = [];
		this.group_size = group_size;
	},
	// methods
	size: function() {
		return this._candidates.length;
	},
	toString: function() {
		return "candicates type " + this.size();
	},
	add:function(candidate) {
		this._candidates.push(candidate)
	},
	toCSV:function() {
		var str = ""
		var size = this._candidates.length
		for(var i = 0; i < size; i++) {
			str += this._candidates[i].toCSV()
			if (i < size - 1) {
				str += "\n"
			}
		}
		return str;
	},
	fromCSV:function(string) {
		if(string == null || string.trim() == ""){
			return;
		}
		objs = csv2array(string.trim(), "\t")
		if(!objs) return
		var size = objs.length;
		for (var i = 0; i < size; i++) {
			if (objs[i].indexOf("姓名") > -1){
				continue;
			}
			this.init_id_for_first_time(objs[i], i)
			this._candidates.push(new Candidate(objs[i], this.group_size))
		}
	},
	init_id_for_first_time:function(objs, i) {
		if (objs.length == 9) {
			objs.unshift(i + 1)				
		}	
	},
	find:function(id) {
		var size = this._candidates.length
		for (var i = 0; i < size; i++) {
			if (this._candidates[i].id == id) {
				return this._candidates[i]
			}
		}

		return null;
	},
	index:function(id) {
		var size = this._candidates.length
		for (var i = 0; i < size; i++) {
			if (this._candidates[i].id == id) {
				return i;
			}
		}
		return -1;
	},
	contains:function(id) {
		return this.index(id) != -1;
	},
	get:function(index) {
		return this._candidates[index];
	},
	update:function(candidate) {
		var index = this.index(candidate.id)
		if (index == -1) return;
		this._candidates.splice(index, 1);
		this.add(candidate)
	},
	render:function() {
		var parent = $("#rank .sub-tab-header");
		this.clean_init()
		for (var i = 0; i < this.size(); i++) {
			var candidate = this.get(i);
			var selected = '';
			var display = 'display:none'
			if (i == 0) {
				selected = "sub-tab-button-active";
				display = "";
			}
			var  open_panel_id = 'open-' +  candidate.group + '-panel';
			var panel_id = candidate.group + '-panel';
			if (!$("#" + open_panel_id).exists()) {
				var template = '<div class="sub-tab-button-container ' + selected + '">'
					+ '<span class="sub-tab-button" id="' + open_panel_id + '">' + candidate.group + '</span>'
				+ '</div>'
				var rendered = $(template);
				parent.append(rendered);
				var content = '<div id="' + panel_id + '" style="' + display + '"></div>';
				$("#single-group").append($(content));
			}
			if (!$("#" + panel_id + " .grade-bg-text").exists()) {
				var content = '<div class="grade gradeA"><div class="grade-bg-text">1</div></div>'
					+ '<div class="grade gradeB"><div class="grade-bg-text">2</div></div>'
					+ '<div class="grade gradeC"><div class="grade-bg-text">3</div></div>'
					+ '<div class="grade gradeD"><div class="grade-bg-text">Pass</div></div>'
				$("#" + panel_id).append($(content));
			}
			candidate.render()
		}
		new Profiles(this).render();
	},
	clean_init:function() {
		$(".candidate").remove();
	},
	persist:function() {
		this.clear();
		getLocalStorage().setItem('candidates', this.toCSV())
	},
	try_persist_and_load:function(html) {
		if (!getLocalStorage().getItem('candidates')) {
			this.fromCSV(html);
			this.persist();
		} else {
			this.load();
		}
	},
	clear:function() {
		getLocalStorage().clear();		
	},
	export_as:function() {
		var str = ""
		var size = this._candidates.length
		for(var i = 0; i < size; i++) {
			var export_as = this._candidates[i].export_as();
			if (export_as == "") {
				continue;
			}
			str += this._candidates[i].export_as()
			if (i < size - 1) {
				str += "\n"
			}
		}
		return str;	
	},
	load:function() {
		this.fromCSV(getLocalStorage().getItem('candidates'));
	},
    rank:function($item, grade) {
		var candidate = this.find($item.attr('id'))
		candidate.updateGrade(grade.attr('class').toString())
		this.persist()
		$item.fadeOut(function() {
			$item.find( "a.ui-icon-refresh" ).remove()
				.end()
				.appendTo(grade)
				.fadeIn();
		});
	},
	females_amount:function() {
		var amount = 0;
		for (var i = 0; i < this.size(); i++) {
			if (this.get(i).is_female()) {
				amount++
			}
		}
		return amount;
	},
	males_amount:function() {
		return this.size() - this.females_amount();
	},
	females_percentage:function() {
		var females_percentage = (this.females_amount() / this.size()) * 100
		return Math.round(females_percentage)
	},
	males_percentage:function() {
		return 100 - this.females_percentage();
	}
});
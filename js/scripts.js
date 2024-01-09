/**
 * Maps to validate tag prefixes from inputs against their value in selects later
 * No need for resource as it's always 'RS'
 * No need for company since user cannot edit the value out of dropdown
 * AC added for SOM to use Activity as driver. Is only available in driverSelect when company == 'SOM'
 */
const driverPrefixMap = new Map([
	['CC', 'CC'],
	['PG', 'PG'],
	['GR', 'GR'],
	['GR', 'GR'],
	['GF', 'GF'],
	['PJ', 'PJ'],
	['AC', 'AC']
]);

const optionalPrefixMap = new Map([
	['AC', 'AC'],
	['AS', 'AS'],
	['GR', 'GR'],
	['IN', 'IN'],
	['PY', 'PY'],
	['PG', 'PG'],
	['WO', 'WO']
]);

/**
 * HTML Form Elements
 * The values of these may change but the elements themselves will not
 * 
 * Dropdowns
 * ...
 * Inputs
 * ...
 * Button Groups for visual Confirmation / Removing already added Tags
 */
const companySelect = document.getElementById('companySelect');
const driverSelect = document.getElementById('driverSelect');
const resourceSelect = document.getElementById('resourceSelect');
const optionalSelect = document.getElementById('optionalSelect');

const driverInput = document.getElementById('driverInput');
const resourceInput = document.getElementById('resourceInput');
const optionalInput = document.getElementById('optionalInput');

const worktagButtonGroup = document.getElementById('companyButtonGroup');
const driverButtonGroup = document.getElementById('driverButtonGroup');
const optionalButtonGroup = document.getElementById('optionalButtonGroup');

/**
 * A set of helper functions to manage the various inputs and buttons 
 * Used to initialize/reset fields or enable/disable selects/inputs/buttons
 * Pass in the element's HTML ID as a string to use them
 */
function enable(element){
	document.getElementById(element).disabled = false;
}

function disable(element){
	document.getElementById(element).disabled = true;
}

function show(element){
	document.getElementById(element).hidden = false;
}

function hide(element){
	document.getElementById(element).hidden = true;
}

function clearSelect(element){
	document.getElementById(element).selectedIndex = 0;
}

function clearInput(element){
	document.getElementById(element).value = '';
}

function focusItem(element){
	document.getElementById(element).focus();
}

/**
 * Resets the form to it's default states
 * Revert all selects to default
 * Clear all Inputs
 * Disable all items except for company select
 * Remove any added tag buttons
 * Hide button rows
 * disable submit btn
 */
function resetForm(){
	enableAllOptionals();
	clearInput('driverInput');
	clearInput('resourceInput');
	clearInput('optionalInput');
	clearInput('FieldValue');
	clearSelect('companySelect');
	clearSelect('driverSelect');
	clearSelect('optionalSelect');
	disable('addOptionalBtn');
	disable('addResourceBtn');
	disable('addDriverBtn');
	disable('driverSelect');
	disable('driverInput');
	disable('addResourceBtn');
	disable('optionalSelect');
	disable('optionalInput');
	disable('resourceSelect');
	disable('resourceInput');
	disable('submitBtn');
	hide('resourceSelect');
	hide('resourceInput');
	hide('addResourceBtn');
	show('addDriverBtn');
	enable('companySelect');
	focusItem('companySelect');
}

/**
 * This returns true if a driver tag needs a resource, else returns false
 * UW1861+CC && SOM+CC Require RS Tag. That's it so far.
 */
function requiresResource(company, driver){
	if ((company == 'UW1861' || company == 'SOM') && driver == 'CC'){
		return true;
	}
	else{
		return false;
	}
}

/**
 * Sets the first two characters of a tag's input field to the correct prefix - EG 'Cost Center' -> 'CC'
 * This is just the value of the select in this implementation
 */
function addDriverPrefix(){
	driverInput.value = driverSelect.value;
}

function addResourcePrefix(){
	resourceInput.value = 'RS';
}

function addOptionalPrefix(){
	optionalInput.value = optionalSelect.value;
}

/**
 * We're adding tags as buttons in button groups. Company, Driver, and Optionals all get their own groups. 
 * If company doesn't exist, create the element and add it to the group.
 * If company already exists, just update the text content.
 * 
 * Company doesn't really need to be a group as there will only ever be one. This was originally all grouped together and I never changed this.
 * Performance is fine, not worrying about it right now.
 */
function addCompanyTag(){
	let worktagButtons = Array.from(worktagButtonGroup.getElementsByTagName('button')); //It's named worktagButtons because this was originally all the tags and I didn't change it
	let selectedCompany = companySelect.value; //value of the company select dropdown
	let companyButton = worktagButtons[0]; //well since it's an array we're using index 0
	//I probably should've just refactored this already ¯\_(ツ)_/¯

	if(selectedCompany === '---'){
		return; //Do nothing when default --- is selected
	}

	if(selectedCompany === 'SOM'){
		somActivityAdd(); //If the company is SOM the user can select 'AC' as a driver tag
	}

	if (!companyButton){ //If there is no company button create a new one and set properties
		let newCompanyButton = document.createElement('button'); //creating a button
		newCompanyButton.type = 'button'; //wow it's a button!
		newCompanyButton.classList.add('btn', 'btn-outline-dark', 'c2-btn'); //bs5 buttons - c2 colorway
		newCompanyButton.textContent = selectedCompany; //Button's text is the value of selectedCompany
		newCompanyButton.id = 'companyButton'; //it's the ID
		newCompanyButton.onclick =  function() { removeWorktagElement(this, "company"); }; //Adding an onclick function to the button for the user to remove the added tag
		worktagButtonGroup.appendChild(newCompanyButton); //Adds the button to the button group
	}
	else{ //If there is a company button then update the text. Probably never going to execute, basically just a fall-back.
		companyButton.textContent = selectedCompany;
	}

	//Adds company to current worktag string, shows button for current company, disables company select, moves on to driver input, generates the final returned worktag string so far
	disable('companySelect');
	enable('driverSelect');
	focusItem('driverSelect');
	show('companyRow');
	stringifyWorktag();
}


//SOM can use 'AC' as a driver tag. Only SOM can do this. Creates an option for an AC Driver and adds it to the driver select when SOM is company
function somActivityAdd(){
	let acDriver = document.createElement('option');
	acDriver.value = 'AC';
	acDriver.text = 'Activity';
	driverSelect.add(acDriver);
}

//If the company was SOM and is changed, remove AC as a driver option
function somActivityRemove() {
    let optionToRemove = document.querySelector("select#driverSelect option[value='AC']");
    if (optionToRemove) {
        optionToRemove.remove();
    }
}


/**
 * Enables driver input when a driver type is selected. Disables if select changes back to default '---'
 * Checks to see if the company/driver combo needs a resource tag. If it does, enable and show the resource fields
 */
function driverTagSelect(){	
	let currentCompany = companySelect.value;
	let selectedDriver = driverSelect.value;
	let needsResource = requiresResource(currentCompany, selectedDriver); //passing in string values for company and driver. Checks to see if the company/driver combo needs an RS tag too.
	
	if(selectedDriver === '---'){
		disable('driverInput'); //do nothing on default select item & don't allow user to add a tag while default
	}
	else if(needsResource){ //If a resource is necessary we enable the RS input
		enable('driverInput');
		addDriverPrefix();

		show('resourceSelect');
		enable('resourceSelect');
		show('resourceInput');
		enable('resourceInput');
		addResourcePrefix();
		show('addResourceBtn');
		
		//Hides and disables normal driver btn because we need resource tag
		disable('addDriverBtn');
		hide('addDriverBtn');

		focusItem('driverInput');
	}
	else{ //when we do not need an RS we don't show the RS input, we just enable the driver input and show the button
		enable('driverInput');
		show('addDriverBtn');
		addDriverPrefix();

		//hides resource stuff in case it was already up when the select was changed
		disable('resourceSelect');
		hide('resourceSelect');
		disable('resourceInput');
		hide('resourceInput');
		disable('addResourceBtn');
		hide('addResourceBtn');

		focusItem('driverInput');
		/**
		 * Note this does not actually ENABLE the button to add a driver tag - it enables the input and SHOWS the button to add a driver tag. Activating the button requires the tag format to be valid.
		 */
	}
}

/**
 * Invoked from the driver tag input field on key up 
 * Enables the 'Add' button only when a Driver tag is 8 characters and has correct prefix
 * If a resource is needed this invokes the resource tag input instead to check both driver AND resource before turning button on.
 */
function driverTagInput(){
	let currentCompany = companySelect.value;
	let selectedDriver = driverSelect.value;
	let currentDriver = driverInput.value;
	let needsResource = requiresResource(currentCompany, selectedDriver);
	
	if(needsResource){
		resourceTagInput(); //resource input function handles both driver & resource, invoking it here to make sure changes to driver input affect resource add btn
		return;
	}

	if(!validateTag(currentDriver, 'driver')){ //Disables 'add' button while tag doesn't meet requirements
		disable('addDriverBtn');
	}
	else{ //When the tag format is valid we allow the user to add it. This does not validate against any actual tag DB - it just checks the prefix is right and the last six chars are numbers
		enable('addDriverBtn');
		focusItem('addDriverBtn');
	}
}

//This is the same thing as driverTagInput() but also checks ths RS input
function resourceTagInput(){
	let currentDriver = driverInput.value;
	let currentResource = resourceInput.value;

	if(validateTag(currentDriver, 'driver')){
		focusItem('resourceInput');
	}
	if(validateTag(currentDriver, 'driver') && validateTag(currentResource, 'resource')){ //When both driver AND resource are valid, enable the button to add them. Note this is a truthy bool check whereas driver alone is falsey.
		enable('addResourceBtn');
		focusItem('addResourceBtn');
	}
	else{
		disable('addResourceBtn');
	}
}

/**
 * Adds Driver Tag Button to Button Group
 * Disables Driver Input. enables optional tag select
 */
function addDriverTag(){
	show('driverRow');

	//Driver and Resource are in the same btn-group, we don't know what the user will select so the container is a button group regardless.
	//It works, performance is fine, whatever. 
	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let selectedDriver = driverInput.value;
	let driverButton = driverButtons[0]; 
	
	if(!driverButton){ //If there is no driver button create a new element and set properties
		let newDriverButton = document.createElement('button');
		newDriverButton.type = 'button';
		newDriverButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newDriverButton.textContent = selectedDriver;
		newDriverButton.id = 'driverButton';
		newDriverButton.onclick =  function() { removeWorktagElement(this, "driver"); };
		driverButtonGroup.appendChild(newDriverButton);
	}
	else{ //If there is a driver button just update the text in it
		driverButton.textContent = selectedDriver;
	}
	//Disable driver selection stuff and move onto optionals
	disable('driverSelect');
	disable('driverInput');
	disable('addDriverBtn');
	enable('optionalSelect');
	enable('submitBtn');
	stringifyWorktag(); //Update the final returned worktag string
	noDuplicateTags(); //If a driver tag that can also be an optional tag (EG, Project) is selected we disable that tag in the Optional Tag select
	focusItem('optionalSelect');
}

// Same as the addDriverTag function, just handles the additional resource tag when that's needed.
function addResourceTag(){
	show('driverRow');

	let driverButtons = Array.from(worktagButtonGroup.getElementsByTagName('button')); //Okay, NOW it actually needs to be an array. Finally this makes sense. 
	let selectedDriver = driverInput.value;
	let selectedResource = resourceInput.value;
	let driverButton = driverButtons[0]; //driver is always before resource
	let resourceButton = driverButtons[1]; //resource is always after driver

	if(!driverButton){ //If there is no driver button create a new element and set properties
		let newDriverButton = document.createElement('button');
		newDriverButton.type = 'button';
		newDriverButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newDriverButton.textContent = selectedDriver;
		newDriverButton.id = 'driverButton';
		newDriverButton.onclick =  function() { removeWorktagElement(this, "driver"); }; //onclick function to remove it
		driverButtonGroup.appendChild(newDriverButton);
	}
	else{
		driverButton.textContent = selectedDriver; //If there is a driver button just update the text in it and set
	}
	if(!resourceButton){ //If there is no resource button create a new element and set properties
		let newResourceButton = document.createElement('button');
		newResourceButton.type = 'button';
		newResourceButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newResourceButton.textContent = selectedResource;
		newResourceButton.id = 'resourceButton';
		newResourceButton.onclick = function() { removeWorktagElement(this, "resource"); }; //onclick function to remove it
		driverButtonGroup.appendChild(newResourceButton);
	}
	else{ //If there is a resource button just update the text in it
		resourceButton.textContent = selectedResource; 
	}
	//disable driver tag stuff and enable optional tag stuff
	disable('driverSelect');
	disable('driverInput');
	disable('resourceSelect');
	disable('resourceInput');
	disable('addResourceBtn');

	enable('optionalSelect');
	enable('submitBtn');

	stringifyWorktag();
	noDuplicateTags();
	focusItem('optionalSelect');
}

//watches optional tag select menu, enables input when selected, pre-populates input w/ correct prefix
function optionalTagSelect(){
	let currentOptional = optionalSelect.value;
	document.getElementById('addOptionalBtn').disabled = true;
	if(currentOptional != '---'){
		enable('optionalInput');
		addOptionalPrefix();
		focusItem('optionalInput');
	}
}

//Watches optional tag input and enables button only while a valid optional tag string exists in the input
function optionalTagInput(){
	let selectedOptional = optionalInput.value;

	if(!validateTag(selectedOptional, "optional")){
		disable('addOptionalBtn');
	}
	else{
		enable('addOptionalBtn');
		focusItem('addOptionalBtn');
	}
}

//Program, Activity, and Grant Stand Alone could all potentially be drivers
//If one of these is a driver we want to disallow the use of that one as an optional tag when enabling optional select
//Hardcoding in the tags that function as both. Currently this is PG / GR / AC
function noDuplicateTags(){
    let currentDriver = driverSelect.value;
    if (currentDriver === 'PG' || currentDriver === 'GR' || currentDriver === 'AC'){
        let optionalToDisable = document.querySelector("#optionalSelect option[value='" + currentDriver + "']");
        if (optionalToDisable) {
            optionalToDisable.disabled = true;
        }
    }
}

//Get all disabled options within optionalSelect, enables them
function enableAllOptionals() {
    let disabledOptions = document.querySelectorAll("#optionalSelect option:disabled");
    disabledOptions.forEach(option => {
        option.disabled = false;
    });
}

/**
 * Adding optional button to group
 * re-creating final return string based on current complete string
 * i is only used in 'addOptionalTag()' but declared outside the function so it doesn't reset each time function is invoked. 
 * i doesn't actually matter in current version but is there for unique element ids anyway
 * I know, mutable variables at a global scope = bad practice
 * I just don't care for this purpose :3 - it's literally just an html ID
 */
let i = 1;

function addOptionalTag(){
	let addedOptional = optionalInput.value;
	
	if(validateTag(addedOptional, "optional")){
		show('optionalRow');
		let worktagButtonGroup = document.getElementById('optionalButtonGroup');

		let newOptionalButton = document.createElement('button');
		//properties for the new button
		newOptionalButton.type = 'button';
		newOptionalButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newOptionalButton.textContent = addedOptional;
		newOptionalButton.id = 'optionalButton' + i;
		newOptionalButton.onclick = function() { removeWorktagElement(this, "optional"); };
		worktagButtonGroup.appendChild(newOptionalButton);//add new button to group
		disableAddedTag(addedOptional); //Disable the Optional Type that was just added, don't want duplicates of the same tag type
		i++; //again not important at all other than for IDs

		//Reset Optional Select/Input to be ready for next opt tag
		clearSelect('optionalSelect');
		clearInput('optionalInput');
		disable('optionalInput');
		disable('addOptionalBtn');
		focusItem('optionalSelect');

		//Update final worktag string
		stringifyWorktag();
	}
	else{
		invalidTag("optional");
	}	
}
 
function disableAddedTag(tag) { //When an optional tag has been added, disallow adding a tag of that type again
    let optionalToDisable = document.querySelector("#optionalSelect option[value='" + tag.substring(0, 2) + "']");
    if (optionalToDisable) {
        optionalToDisable.disabled = true;
    }
}

function enableRemovedTag(tag) { //When an optional tag is removed, re-allow adding a tag of that type
    let optionalToEnable = document.querySelector("#optionalSelect option[value='" + tag.substring(0, 2) + "']");
    if (optionalToEnable) {
        optionalToEnable.disabled = false;
    }
}

/**
 * Removes selected worktag element from constructed buttons and strings
 * clearing company resets everything
 * clearing driver resets everything except company
 * clearing optional only resets that optional
 * 
 * Pass in args as the actual button element and the type of button as a string 'company' 'driver' or 'optional' 
 */
function removeWorktagElement(button, type){
	let companyButton = document.getElementById('companyButton');
	let driverButtonGroup = document.getElementById('driverButtonGroup');
	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let optionalButtonGroup = document.getElementById('optionalButtonGroup');
	let optionalButtons = Array.from(optionalButtonGroup.getElementsByTagName('button'));
	
	if(type == 'company'){
		optionalButtons.forEach( button => {
			button.remove();
		});
		driverButtons.forEach( button => {
			button.remove();
		});
		if(companyButton.textContent == 'SOM'){ 
			somActivityRemove(); //If SOM was the company they had access to the AC driver - we need to revoke this driver option when SOM company is removed
		}
		
		companyButton.remove();
		resetForm(); //since this resets everything
		hide('companyRow');
		hide('driverRow');
		hide('optionalRow');
	}
	else if(type == 'driver' || type == 'resource'){ //If clicking to remove either a driver or resource we consider it removing the driver
		optionalButtons.forEach( button => {
			button.remove();
		});
		driverButtons.forEach( button => {
			button.remove();
		});
		//this is basically resetForm() but without the company clearing
		clearSelect('driverSelect');
		clearInput('driverInput');
		clearInput('resourceInput');
		disable('resourceInput');
		disable('resourceSelect');
		disable('addResourceBtn');
		disable('optionalSelect');
		disable('addOptionalBtn');
		disable('submitBtn');
		hide('resourceInput');
		hide('resourceSelect');
		hide('addResourceBtn');
		hide('driverRow');		
		hide('optionalRow');
		enable('driverSelect');
		show('addDriverBtn');
		focusItem('driverSelect');
		enableAllOptionals();
		stringifyWorktag();
	}
	else if(type == 'optional'){
		let tag = button.textContent;
		optionalButtonGroup.removeChild(button);
		stringifyWorktag();
		enableRemovedTag(tag);
		if(optionalButtonGroup.childElementCount == 0){ //Hide the optional button group row when no more optionals exist. Just looks nice.
			hide('optionalRow');
		}
	}
}

/**
 * Validates all tags as they're typed into input
 * Split tag into prefix and numbers. Uses maps defined at start to verify prefixes match the selected driver. regex to confirm following 6 characters are all 0-9 digits.
 */
function validateTag(tag, tagType){ //Where tag is the text value of the input, and tagType is a string indicating which type of tag the input is for. 'company' 'driver' 'resource' or 'optional'
	if (tag.length < 8) { return false; }
	let chars = tag.slice(0, 2);
	let nums = tag.slice(2);
	let charsAreValid = false;

	if(tagType == 'driver'){
		let driver = driverSelect.value;
		let expectedValue = driverPrefixMap.get(driver);
		charsAreValid = expectedValue === chars; //is true when the chars match the paired key in driver value/prefix map
	}
	else if(tagType == 'resource' && chars == 'RS'){
		charsAreValid = true; //because resource can only be RS
	}
	else if(tagType == 'optional'){
		let optional = optionalSelect.value;
		let expectedValue = optionalPrefixMap.get(optional); //The maps at the start? That's where this is used. 
		charsAreValid = expectedValue === chars; //is true when the chars match the paired key in optional value/prefix map
	}

	//checks the number part of the tag is six numerical digits and assigns true or false accordingly
	let numsAreValid = /^\d{6}$/.test(nums);

	if (charsAreValid && numsAreValid){
		return true; //returns true when both parts of tag string match expected format
	}
	else{
		return false; //or false if either check fails
	}
}

/**
 * Construct a string for the final return to pace. updates a hidden input's text value whenever a tag is added.
 */
function stringifyWorktag(){
	let company = companySelect.value; //Funny how it turns out I'm not even using the button - I'm using the select's value. Huh! I didn't even remember this until looking back.
	let worktagString = ''; //We are not concatenating, but over-writing the whole thing. This prevents any removed tags from persisting. Performance is fine, I'm not worrying about optimizing it. 
	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let optionalButtons = Array.from(optionalButtonGroup.getElementsByTagName('button'));
		
	worktagString += company + ';'; //adds a semi-colon after the company, since we want a semi-colon between each tag

	//Loop through driver + optional button groups and add the tags in each to the final string
	driverButtons.forEach( button =>
		{ worktagString += button.textContent + ';'; } 
	);
	optionalButtons.forEach( button =>
		{ worktagString += button.textContent + ';' }
	);
	//console.log(`Stringified Worktag: ${worktagString}`); //Console debug line
	document.getElementById('FieldValue').value = worktagString; //update the actual field with the string
	return worktagString; //Generally this doesn't need to actually return anything, but it helped with debugging early on and I don't remember if I actually use the return now.
}


/**
 * In the different versions of this code this does different things. For the DSF one this submits back to the DSF checkout.
 * In this case, it copies the string to the clipboard, since this form is solely for AMs to 'build' tags without typing the final formatted string. IDK why they want it, but they like having it so it is what it is.
 */
function submitWorktags(){
	let submitted = stringifyWorktag();
	navigator.clipboard.writeText(submitted);
	copyConfirm(submitted);
	
}	

/**
 * Same deal, this is literally only to flash a "copied string" message and isn't really needed anywhere else
 */
function copyConfirm(tagString){ 
	let errorMsgElement = document.getElementById('error_msg');
	errorMsgElement.classList.remove('fade-out');
	errorMsgElement.innerHTML = `<p class="error-msg"><b>Worktag String ${tagString} Copied to Clipboard.</b></p>`;
	setTimeout(() => {
		errorMsgElement.classList.add('fade-out');
	}, 2000);
	setTimeout(() => {
		errorMsgElement.innerHTML = '';
	}, 3000);
}	
	

/**
 * DEPRECATED FUNCTIONS
 * Anything below this is not used in current implementation unless something goes very wrong
 */
	
//throws an error message to the DOM in edge cases where user tries to add invalid tag
//should be completely impossible to invoke now but leaving it in case it's useful later
function invalidTag(type){ 
	let errorMsgElement = document.getElementById('error_msg');
	errorMsgElement.classList.remove('fade-out');
	errorMsgElement.innerHTML = `<p class="error-msg"><b>Invalid ${type} tag. Include both 2-character prefix and 6-digit numerical code.</b></p>`;
	setTimeout(() => {
		errorMsgElement.classList.add('fade-out');
	}, 2000);
	setTimeout(() => {
		errorMsgElement.innerHTML = '';
	}, 3000);
}
	
	
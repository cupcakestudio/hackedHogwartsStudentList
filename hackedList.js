/*CLEAN DATA V1*/
"use strict";
//OBJECTS
const Student = {
  firstName: "",
  lastName: "",
  middleName: "undefined",
  nickName: "null",
  house: "",
};

const settings = {
  filter: "0",
  sortBy: "name",
  sortDirection: "asc",
};
//filter dropdown menu
const filterActive = document.querySelector("#filtering");
//filter button
const filterButton = document.querySelector("#filter");
const sortButton = document.querySelector("#sort");

//all List arrays
const allStudents = [];

// global var
// let template = document.querySelector(".FilteredStudentList");
let template = document.querySelector("#ListDisplay .FilteredStudentList");
//houses
let gryffindorStudentsList;
let slytherinStudentsList;
let hufflepuffStudentsList;
let ravenclawStudentsList;
//generic filter
let filterBy = "0";

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  loadJSON();
}

async function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}
document.addEventListener("DOMContentLoaded", filterButtonActive);
document.addEventListener("DOMContentLoaded", sortButtonActive);

//function to listen after filter button has been clicked
function filterButtonActive() {
  //add eventlistener for when a filter has been changed
  filterButton.addEventListener("click", () => {
    //filter all students into correct lists based on filter and display the array
    if (filterActive.value === "Gryffindor") {
      gryffindorStudentsList = allStudents.filter(filterGryffindor);
      displayList(gryffindorStudentsList);
      // sortButton.addEventListener("click", selectSort());
    }
    if (filterActive.value === "Slytherin") {
      slytherinStudentsList = allStudents.filter(filterSlytherin);
      displayList(slytherinStudentsList);
    }
    if (filterActive.value === "Hufflepuff") {
      hufflepuffStudentsList = allStudents.filter(filterHufflepuff);
      displayList(hufflepuffStudentsList);
    }
    if (filterActive.value === "Ravenclaw") {
      ravenclawStudentsList = allStudents.filter(filterRavenclaw);
      displayList(ravenclawStudentsList);
    }
  });
}

//function to listen after sort button has been clicked
function sortButtonActive() {
  sortButton.addEventListener("click", selectSort(this.value));
}
function selectSort(value) {
  const sortBy = value;
  console.log(sortBy);
}

function prepareObjects(jsonData) {
  console.log(jsonData);
  jsonData.forEach((jsonObject) => {
    //create new instance of student
    const student = Object.create(Student);
    //store the fullname property with no spaces before or after string
    let fullnameString = jsonObject.fullname;

    //get values from fullnameString (json data) to populate the student properties

    let result = "";

    // STUDENTS FIRSTNAME
    //temporary var to store trimmed or not trimmed first name
    let trimmedString1 = fullnameString.trimStart();
    result = trimmedString1.substring(0, trimmedString1.indexOf(" "));
    //special case of one, find a better way
    if (fullnameString === "Leanne") {
      result = fullnameString;
    }
    student.firstName =
      result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

    // STUDENTS LASTNAME

    let trimmedString2 = "";
    let result2 = "";
    //trim the end of fullname property string, so no spaces after last letter
    trimmedString2 = fullnameString.trimEnd();

    //make substring starting from last read space +1
    result2 = trimmedString2.substring(trimmedString2.lastIndexOf(" ") + 1);
    student.lastName =
      result2.charAt(0).toUpperCase() + result2.slice(1).toLowerCase();
    //if trimmedString only has fullname 'Leanne'
    if (trimmedString2 === "Leanne") {
      student.lastName = result2;
    }
    //if lastname has - in it
    else if (student.lastName.includes("-")) {
      student.lastName =
        //start by getting first part before -
        result2.substring(0, result2.lastIndexOf("-") + 1) +
        //then get first char after - and ONLY THE FIRST CHAR, make capital
        result2
          .substring(result2.lastIndexOf("-") + 1, result2.lastIndexOf("-") + 2)
          .toUpperCase() +
        //get rest of lastname in lowercase
        result2.substring(result2.lastIndexOf("-") + 2).toLowerCase();
    }

    // STUDENT MIDDLENAME

    let midName = "";
    let trimmedString3 = "";
    let result3 = "";
    //trim the fullname
    trimmedString3 = fullnameString.trim();
    //get trimmed fullname string and start new string by first space, end before last space
    //trim afterwards
    result3 = trimmedString3
      .substring(trimmedString3.indexOf(" "), trimmedString3.lastIndexOf(" "))
      .trim();

    midName = result3;

    //make first char uppercae and rest lowercase
    student.middleName =
      midName.charAt(0).toUpperCase() + midName.slice(1).toLowerCase();

    //if middleName results in an empty string, or has "" set property to null
    if (student.middleName.includes(`"`) || student.middleName === "") {
      student.middleName = "null";
    }

    let result4 = fullnameString.substring(
      fullnameString.indexOf(`"`),
      fullnameString.lastIndexOf(`"`) + 1
    );
    student.nickName = result4.replaceAll(`"`, ``);

    //capitalize house names!
    let houseName = jsonObject.house;
    houseName = houseName.trimStart();
    houseName = houseName.trimEnd();

    student.house =
      houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase();

    //images to display for each student
    let image = new Image(100, 100);

    // read imagefile name based on their lastname in lower case to match
    let imageFile = student.lastName.toLowerCase();
    // image.src = images.substring("images\\\\", "images\\\\".lastIndexOf("_"));

    //if image src has match with this pattern: lastname_firstLetter.png
    //using regex would be better...
    image.src = `images/${imageFile}_${student.firstName
      .charAt(0)
      .toLowerCase()}.png`;

    student.image = image.src;

    //check for unusual patterns.
    if (student.image.match("leanne")) {
      student.image = "undefined";
    } else if (student.image.includes("-")) {
      //if student has hyphen in lastname, start from char after hyphen. but with same pattern
      imageFile = student.lastName
        .substring(student.lastName.indexOf("-") + 1)
        .toLowerCase();
      image.src = `images/${imageFile}_${student.firstName
        .charAt(0)
        .toLowerCase()}.png`;
      student.image = image.src;
    } else if (student.image.includes("patil")) {
      //if student has name patil, then read entire firstname and match on pattern to find file.
      //future stuff: find a way to check if you can read if one student has same lastname as another

      imageFile = student.lastName.substring(0).toLowerCase();
      image.src = `images/${imageFile}_${student.firstName
        .substring(0)
        .toLowerCase()}.png`;
      student.image = image.src;
    }
    console.log(student.image);
    allStudents.push(student);
  });
  //make array to a table
  console.table(allStudents);
  return allStudents.student;
}

//filter one student after it's house

function filterGryffindor(student) {
  //got the code line inspired by mdn filter by search query
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  // const gryffindorStudentsList = allStudents.filter((student) =>
  //   student.house.includes("Gryffindor")
  // );
  if (student.house === "Gryffindor") {
    return true;
  }
  return false;
  // console.log(gryffindorStudentsList);
  // return gryffindorStudentsList;
}

function filterSlytherin(student) {
  // const slytherinStudentsList = allStudents.filter((student) =>
  //   student.house.includes("Slytherin")
  // );
  if (student.house === "Slytherin") {
    return true;
  }
  return false;
}
function filterHufflepuff(student) {
  // const hufflepuffStudentsList = allStudents.filter((student) =>
  //   student.house.includes("Hufflepuff")
  // );
  if (student.house === "Hufflepuff") {
    return true;
  }
  return false;
}
function filterRavenclaw(student) {
  // const ravenclawStudentsList = allStudents.filter((student) =>
  //   student.house.includes("Ravenclaw")
  // );
  if (student.house === "Ravenclaw") {
    return true;
  }
  return false;
}
//
//DISPLAY STUDENTS
function displayList(list) {
  document.querySelector("h2").textContent = "Gryffindor";
  displayStudentList(list);
  console.log(list);
}

//TODO: DISPLAY STUDENTS
function displayStudentList(list) {
  //styling the list view - hide all the 'banner housecrest' lists - not pretily removed :)
  document.querySelector("#GhouseCrest").classList.add("hide");
  document.querySelector("#ShouseCrest").classList.add("hide");
  document.querySelector("#HhouseCrest").classList.add("hide");
  document.querySelector("#RhouseCrest").classList.add("hide");

  document.querySelector(".main_list").classList.add("studentList");

  //var stored of the filtered array List
  let StudentListToDisplay = list;

  //get h2 house name to get display
  let listToDisplay = document.querySelector("#ListDisplay");
  // listToDisplay.querySelector("h2").textContent = student.house;
  // get list name from filtervalue and make sure that #ListDisplay keeps div and headline and p tag before template tag's students get inserted
  listToDisplay.innerHTML = `<h2>${filterActive.value}</h2>
  <p class="StudentHeadline">Students:</p>`;
  //clear displayList each time it studentListToDisplay gets run w/ filter (and or sort.)
  StudentListToDisplay.forEach((studentListed) => {
    //each student in the listDisplay Node
    let studentListClone = template.content.cloneNode(true);
    //set name to each student Node

    //bad workaround for only one name
    if (studentListed.firstName === "Leanne") {
      studentListClone.querySelector(
        "p"
      ).textContent = `${studentListed.firstName}`;
    }
    //if they have a nickname instead of middlename
    else if (
      studentListed.middleName === "null" &&
      studentListed.nickName !== ""
    ) {
      studentListClone.querySelector(
        "p"
      ).textContent = `${studentListed.firstName} "${studentListed.nickName}" ${studentListed.lastName}`;
    }
    //if they don't have a middleName
    else if (studentListed.middleName === "null") {
      studentListClone.querySelector(
        "p"
      ).textContent = `${studentListed.firstName} ${studentListed.lastName} `;
    }

    //if they have a middleName
    else {
      studentListClone.querySelector(
        "p"
      ).textContent = `${studentListed.firstName} ${studentListed.middleName} ${studentListed.lastName}`;
    }
    //append the student name to the listDisplay Container
    listToDisplay.appendChild(studentListClone);
  });
  //append template student list to display in main_list container.
  return document.querySelector(".main_list").appendChild(listToDisplay);
}

//in order to build the view
// buildList()

//SORT THE STUDENTS
//selected sort value
// function selectSort(event) {
//   const sortBy = event.target.value;
//   console.log(sortBy);
// }
// function sortList(list) {
//   if (studentA.firstname > studentB.firstname) {
//     return console.log();
//   }
// }

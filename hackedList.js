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

//filter dropdown menu
const filterActive = document.querySelector("#filtering");

//sorting dropdown menu  var
const sortingActive = document.querySelector("#sorting");
//search field
const searchValue = document.querySelector("#search");

//all List arrays
const allStudents = [];
const prefectArray = [];

// global var
// let template = document.querySelector(".FilteredStudentList");
let template = document.querySelector("#ListDisplay .FilteredStudentList");
//houses
let filteredStudentsList;

//generic filter
let filterBy = "0";

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  loadJSON();
  document.querySelector(".StudentHeadline").classList.add("hide");
  document.querySelector("#ListDisplay").classList.add("hide");
}

async function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

//BLOODSTATUS LIST
async function getBloodStatus() {
  const blooddata = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  const bloodstatus = await blooddata.json();
  setBloodStatus(bloodstatus);
}
//get field value for filter and sort
//sort on cases which corresponds to sort field value using localeCompare(), e.g. sort alphabetically;
//return that to the filter function in order to filter allStudents array correctly, based on filter field value.
function getFilterSortSearchValues() {
  return allStudents
    .filter(
      (
        s //filter after the student filter dropdown property
      ) =>
        (s.house === filterActive.value ||
          (s.prefect && filterActive.value === "Prefects") ||
          (s.squad && filterActive.value === "Inquisitor Squad") ||
          (s.expelled && filterActive.value === "Expelled")) &&
        //filter after searchfield - searching across searchValue and compare to the students names
        (s.firstName + " " + s.lastName).includes(searchValue.value)
    ) //SORTING
    .sort((s1, s2) => {
      //expr in switch statement is the thing i want to check
      switch (sortingActive.value) {
        //expr in case statement is the string i want to check against.
        case "Firstname":
          return s1.firstName.localeCompare(s2.firstName);
        case "Lastname":
          return s1.lastName.localeCompare(s2.lastName);
        default:
          0;
      }
    });
}

//Eventlistener for FILTERING dropdown menu activate

//add eventlistener for when a filter has been changed
filterActive.addEventListener("change", () =>
  displayList(getFilterSortSearchValues())
);

//Eventlistener for SORTING dropdown menu activate
sortingActive.addEventListener("change", () =>
  displayList(getFilterSortSearchValues())
);

searchValue.addEventListener("input", () =>
  displayList(getFilterSortSearchValues())
);

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

    //set prefect status test
    student.prefect = false;

    allStudents.push(student);
  });
  //loading new properties (bloodstatus) in the allStudents array.
  setBloodStatus(getBloodStatus());

  console.table(allStudents);

  return allStudents.student;
}

//SET BLOODSTATUS TO EACH STUDENT BASED ON BLOODSTATUSLIST
function setBloodStatus(bloodstatus) {
  // console.log(allStudents);
  allStudents.forEach((s) => {
    s.isHalf =
      bloodstatus.half.includes(s.lastName) ||
      (bloodstatus.pure.includes(s.lastName) &&
        bloodstatus.half.includes(s.lastName));
    s.isPure =
      bloodstatus.pure.includes(s.lastName) &&
      !bloodstatus.half.includes(s.lastName);
    s.isMuggle =
      !bloodstatus.half.includes(s.lastName) &&
      !bloodstatus.pure.includes(s.lastName);
  });

  return allStudents;
}

//
//DISPLAY STUDENTS
function displayList(list) {
  // document.querySelector("h2").textContent = "";
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
  document.querySelector("#ListDisplay").classList.remove("hide");

  document.querySelector(".main_list").classList.add("studentList");

  //var stored of the filtered array List
  let StudentListToDisplay = list;

  //get h2 house name to get display
  let listToDisplay = document.querySelector("#ListDisplay");
  let listOverview = document.querySelector(".ListOverview");
  //get house banner
  const banner = listOverview.querySelector("#houseBanner");
  // listToDisplay.querySelector("h2").textContent = student.house;
  // get list name from filtervalue and make sure that #ListDisplay keeps div and headline and p tag before template tag's students get inserted
  if (filterActive.value === "Gryffindor") {
    banner.src = "picture_materials/Gryf_houseBanner.svg";
  } else if (filterActive.value === "Slytherin") {
    banner.src = "picture_materials/Slyt_houseBanner.svg";
  } else if (filterActive.value === "Hufflepuff") {
    banner.src = "picture_materials/Huff_houseBanner.svg";
  } else if (filterActive.value === "Ravenclaw") {
    banner.src = "picture_materials/Rave_houseBanner.svg";
  } else if (filterActive.value === "Prefects") {
    banner.src = "picture_materials/prefectBanner.svg";
  } else if (filterActive.value === "Inquisitor Squad") {
    banner.src = "";
  }
  //clear listToDisplay container each time it studentListToDisplay gets run w/ filter (and or sort.)
  listToDisplay.innerHTML = ``;

  StudentListToDisplay.forEach((studentListed) => {
    //each student in the listDisplay Node
    let studentListClone = template.content.cloneNode(true);
    //set name to each student Node
    const nameDisplay = studentListClone.querySelector("p");
    const bloodStatusImgDisplay = studentListClone.querySelector(
      `.bloodStatusImgDisplay`
    );
    //bad workaround for only one name
    if (studentListed.firstName === "Leanne") {
      nameDisplay.textContent = `${studentListed.firstName}`;
    }
    //if they have a nickname instead of middlename
    else if (
      studentListed.middleName === "null" &&
      studentListed.nickName !== ""
    ) {
      nameDisplay.textContent = `${studentListed.firstName} "${studentListed.nickName}" ${studentListed.lastName}`;
    }
    //if they don't have a middleName
    else if (studentListed.middleName === "null") {
      nameDisplay.textContent = `${studentListed.firstName} ${studentListed.lastName} `;
    }

    //if they have a middleName
    else {
      nameDisplay.textContent = `${studentListed.firstName} ${studentListed.middleName} ${studentListed.lastName}`;
    }

    if (studentListed.isHalf) {
      bloodStatusImgDisplay.src = `picture_materials/halfBlood_icon.svg`;
    } else if (studentListed.isPure) {
      bloodStatusImgDisplay.src = `picture_materials/pureBlood_icon.svg`;
    } else {
      bloodStatusImgDisplay.src = `picture_materials/Muggle_icon.svg`;
    }

    //DETAILS POPOP
    function detailsPopop() {
      console.log("i have beenclicked");

      const detailsList = document.querySelector(".details");
      const detailImg = detailsList.querySelector("img");
      const houseEmblem = detailsList.querySelector(".houseEmblem");
      const bloodIcon = detailsList.querySelector(".bloodStatusImg");
      //details about the student data is loaded here
      detailsList.style.display = "grid";

      //LOAD IMAGES IN DETAILS
      // //images to display for each student

      //  read imagefile name based on their lastname in lower case to match
      let imageFile = studentListed.lastName.toLowerCase();
      detailImg.src = `images/${imageFile}_${studentListed.firstName
        .charAt(0)
        .toLowerCase()}.png`;
      //if lastnames are identical, this case 'patil'
      if (imageFile.includes("patil")) {
        detailImg.src = `images/${imageFile}_${studentListed.firstName}.png`;
      } else if (imageFile.includes("-")) {
        //if student has hyphen in lastname, start from char after hyphen. but with same pattern
        imageFile = studentListed.lastName
          .substring(studentListed.lastName.indexOf("-") + 1)
          .toLowerCase();

        detailImg.src = `images/${imageFile}_${studentListed.firstName
          .charAt(0)
          .toLowerCase()}.png`;
      } else if (imageFile.includes("leanne")) {
        detailImg.src = "";
        detailImg.alt = "Not Available";
      }
      //HOUSE EMBLEM
      if (studentListed.house === "Gryffindor") {
        houseEmblem.src = `picture_materials/Gryffindor_emblem.svg`;
        // houseEmblem.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.house === "Slytherin") {
        houseEmblem.src = `picture_materials/Slytherin_emblem.svg`;
      } else if (studentListed.house === "Hufflepuff") {
        houseEmblem.src = `picture_materials/Hufflepuff_emblem.svg`;
      } else {
        houseEmblem.src = `picture_materials/Ravenclaw_emblem.svg`;
      }
      //NAME OF STUDENT
      detailsList.querySelector(".name").textContent = nameDisplay.textContent;

      //BLOODSTATUS - icons!
      detailsList.querySelector(".bloodtype").textContent = `BloodStatus: `;
      if (studentListed.isHalf) {
        bloodIcon.src = `picture_materials/halfBlood_icon.svg`;
        // bloodIcon.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.isPure) {
        bloodIcon.src = `picture_materials/pureBlood_icon.svg`;
      } else {
        bloodIcon.src = `picture_materials/Muggle_icon.svg`;
      }
      //TODO: TOGGLE PREFECTS AND EXPEL STUDENTS - make funcitonality and activity diagram
      detailsList.querySelector(".isPrefect").textContent = "Prefect: ";
      detailsList
        .querySelector(".makePrefect")
        .addEventListener("click", clickPrefect);
      //TODO: MAKE SURE IT ONLY CHANGES SO THAT A NEW ONE CAN BE A PREFECT
      function clickPrefect() {
        if (!studentListed.prefect && prefectArray.length === 2) {
          document.querySelector(".removePrefect").classList.remove("hide");
          document.querySelector(
            "#removePrefectA"
          ).textContent = `Replace Prefect: ${prefectArray[0].firstName} with ${studentListed.firstName}?`;
          document.querySelector(
            "#removePrefectB"
          ).textContent = `Replace Prefect: ${prefectArray[1].firstName} with ${studentListed.firstName}?`;
          document
            .querySelector("#removePrefectA")
            .addEventListener("click", () => {
              removePrefectA(studentListed);
              document.querySelector(".removePrefect").classList.add("hide");
            });
          document
            .querySelector("#removePrefectB")
            .addEventListener("click", () => {
              removePrefectB(studentListed);
              document.querySelector(".removePrefect").classList.add("hide");
            });

          console.log("removed has been clicked");
          // alert("only 2 prefects!");
          // detailsList.querySelector(".isPrefect").textContent += "";
          // removePrefectAB(studentListed);
        } else if (!studentListed.prefect && prefectArray.length < 2) {
          studentListed.prefect = true;
          // detailsList.querySelector(".isPrefect").textContent += "Yes";
          togglePrefect(studentListed);
        }
      }
      if (studentListed.prefect) {
        console.log("Im a prefect");
        detailsList.querySelector(".PrefectBoolText").textContent = "Yes";
      } else {
        detailsList.querySelector(".PrefectBoolText").textContent = "";
      }
      // && prefectArray.length < 2
      //CLOSE DETAILS
      detailsList
        .querySelector("#close")
        .addEventListener("click", () => (detailsList.style.display = "none"));
      //when filter gets changes also close the details popop
      filterActive.addEventListener(
        "change",
        () => (detailsList.style.display = "none")
      );

      document.querySelector(".main_list").appendChild(detailsList);
    }
    nameDisplay.addEventListener("click", detailsPopop);
    //append the student name to the listDisplay Container
    listToDisplay.appendChild(studentListClone);
  });

  //interface display of information about the lists
  document.querySelector(
    ".info_list"
  ).textContent = ` Total of Students: ${allStudents.length},`;
  // if (filterActive.value === "Gryffindor") {
  //   document.querySelector(
  //     ".info_list"
  //   ).textContent = ` Students in House: ${StudentListToDisplay.length}`;
  // }
  if (filterActive.value === "Slytherin") {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in House: ${StudentListToDisplay.length}`;
  } else if (filterActive.value === "Hufflepuff") {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in House: ${StudentListToDisplay.length}`;
  } else {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in House: ${StudentListToDisplay.length}`;
  }
  //append template student list to display in main_list container.
  return document.querySelector(".main_list").appendChild(listOverview);
}

// function removePrefectAB(studentPrefect) {
//   // document.querySelector(".removePrefect").classList.remove("hide");
//   // document
//   //   .querySelector("#removePrefectA")
//   //   .addEventListener("click", removePrefect(studentPrefect));
//   // document
//   //   .querySelector("#removePrefectB")
//   //   .addEventListener("click", removePrefect(studentPrefect));
//   // removePrefect(studentPrefectA);
// }
//TODO: do the same for 'that' button, so that element 1 gets replaced with another student
function removePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== prefectArray[0].firstName) {
    prefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(prefectArray[0], "im false");
    prefectArray.shift(studentPrefect);
    prefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(".PrefectBoolText").textContent = "Yes";

  console.log(prefectArray);
}
//TODO: do the same for 'that' button, so that element 1 gets replaced with another student
function removePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== prefectArray[1].firstName) {
    prefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(prefectArray[1], "im false");
    prefectArray.shift(studentPrefect);
    prefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(".PrefectBoolText").textContent = "Yes";

  console.log(prefectArray);
}

function togglePrefect(studentPrefect) {
  console.log("Truthy");
  prefectArray.unshift(studentPrefect);
  console.log(prefectArray);
  document.querySelector(".PrefectBoolText").textContent += "Yes";
}

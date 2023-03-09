/*CLEAN DATA V1*/
"use strict";
//OBJECTS
const Student = {
  firstName: "",
  lastName: "",
  middleName: "undefined",
  nickName: "null",
  house: "",
  //added properties to student object
  isSquadMember: false,
  expelled: false,
};

//filter dropdown menu
const filterActive = document.querySelector("#filtering");

//sorting dropdown menu  var
const sortingActive = document.querySelector("#sorting");
//search field
const searchValue = document.querySelector("#search");

//all List arrays
let allStudents = [];
//find another more generic way to see/set/get the prefects!!
const gryfPrefectArray = [];
const slytPrefectArray = [];
const huffPrefectArray = [];
const ravePrefectArray = [];
const squadArray = [];
const expelledArray = [];

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
          (s.isSquadMember && filterActive.value === "Inquisitor Squad") ||
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
filterActive.addEventListener("change", () => {
  //if filter is inq. squad
  if (filterActive.value === "Inquisitor Squad") {
    displayList(squadArray);
    console.log("suqd");
  }
  if (filterActive.value === "Expelled") {
    displayList(expelledArray);
    console.log("expel!");
  } else {
    displayList(getFilterSortSearchValues());
  }
});

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
    student.gender = jsonObject.gender;
    console.log(student.gender);
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
    banner.src = "picture_materials/prefectBanner.svg";
  } else if (filterActive.value === "Expelled") {
    banner.src = "picture_materials/prefectBanner.svg";
  } else {
    document.querySelector("#GhouseCrest").classList.remove("hide");
    document.querySelector("#ShouseCrest").classList.remove("hide");
    document.querySelector("#HhouseCrest").classList.remove("hide");
    document.querySelector("#RhouseCrest").classList.remove("hide");
    document.querySelector(".main_list").classList.remove("studentList");
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
    const prefectIconImgDisplay = studentListClone.querySelector(
      ".prefectIconImgDisplay"
    );
    //bad workaround for only one name
    if (studentListed.firstName === "Leanne") {
      nameDisplay.textContent = `${studentListed.firstName}` + ` -`;
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

    if (filterActive.value === "Prefects") {
      bloodStatusImgDisplay.src = ``;
      if (studentListed.house === "Gryffindor") {
        prefectIconImgDisplay.src = `picture_materials/Gryffindor_emblem.svg`;
        // houseEmblem.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.house === "Slytherin") {
        prefectIconImgDisplay.src = `picture_materials/Slytherin_emblem.svg`;
      } else if (studentListed.house === "Hufflepuff") {
        prefectIconImgDisplay.src = `picture_materials/Hufflepuff_emblem.svg`;
      } else {
        prefectIconImgDisplay.src = `picture_materials/Ravenclaw_emblem.svg`;
      }
    }
    // if (filterActive.value === "Inquisitor Squad") {
    //   bloodStatusImgDisplay.src = ``;
    //   // studentListed.isSquadMember;
    //   console.log(squadArray);
    //   document
    //     .querySelector(".makeSquad")
    //     .addEventListener("click", () => removeSquadMember(studentListed));
    // }

    //DETAILS POPOP
    function detailsPopop() {
      console.log("i have beenclicked");

      const detailsList = document.querySelector(".details");
      const detailImg = detailsList.querySelector("img");
      const houseEmblem = detailsList.querySelector(".houseEmblem");
      const bloodIcon = detailsList.querySelector(".bloodStatusImg");
      //details about the student data is loaded here
      detailsList.style.display = "grid";
      //theming the detailstList
      if (studentListed.house === "Gryffindor") {
        detailsList.style.backgroundColor = "var(--gryfRed)";
      }
      if (studentListed.house === "Slytherin") {
        detailsList.style.backgroundColor = "var(--slytGreen)";
      }
      if (studentListed.house === "Hufflepuff") {
        detailsList.style.backgroundColor = "var(--huffYellow)";
      }
      if (studentListed.house === "Ravenclaw") {
        detailsList.style.backgroundColor = "var(--raveBlue)";
      }
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
      //TOGGLE PREFECTS make activity diagram
      detailsList.querySelector(".isPrefect").textContent = "Prefect: ";
      detailsList
        .querySelector(".makePrefect")
        .addEventListener("click", () => clickPrefect(studentListed));

      if (studentListed.prefect) {
        console.log("Im a prefect");

        if (studentListed.house === "Gryffindor") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Gryf_prefect.svg`;
        }
        if (studentListed.house === "Slytherin") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Slyt_prefect.svg`;
        }
        if (studentListed.house === "Hufflepuff") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Huff_prefect.svg`;
        }
        if (studentListed.house === "Ravenclaw") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Rave_prefect.svg`;
        }
      } else {
        detailsList.querySelector(".prefectIcon").src = ``;
      }
      // TOGGLE INQUISITORIAL SQUAD:
      detailsList.querySelector(".isSquad").textContent =
        "Inquisitorial Squad: ";
      document.querySelector(".makeSquad").textContent = "Make Member";
      detailsList.querySelector(".makeSquad").addEventListener("click", () => {
        clickSquadMember(studentListed);
      });
      if (studentListed.isSquadMember) {
        detailsList.querySelector("#squadM").textContent = "yes";
        document.querySelector(
          ".squadIcon"
        ).src = `/picture_materials/Squad_icon.svg`;
        document.querySelector(".makeSquad").classList.add("hide");
        document.querySelector(".removeSquad").classList.remove("hide");
        detailsList
          .querySelector(".removeSquad")
          .addEventListener("click", () => {
            removeSquadMember(studentListed);
          });
      } else {
        document.querySelector(".makeSquad").classList.remove("hide");
        document.querySelector(".removeSquad").classList.add("hide");
        detailsList.querySelector(".isSquad").textContent += "";
        detailsList.querySelector("#squadM").textContent = "";
        document.querySelector(".squadIcon").src = ``;
      }
      //EXPEL STUDENTS
      detailsList.querySelector("#isExpelled").textContent = "";
      detailsList.style.filter = "none";
      detailsList.querySelector(".expellingStudent").classList.remove("hide");
      detailsList
        .querySelector(".expellingStudent")
        .addEventListener("click", () => expelAStudent(studentListed));

      if (studentListed.expelled) {
        detailsList.style.filter = "grayscale(100%)";
        detailsList
          .querySelector(".expellingStudent")
          .removeEventListener("click", () => {
            expelAStudent(studentListed);
            console.log();
          });
        detailsList.querySelector("#isExpelled").textContent = "Expelled";
        detailsList.querySelector(".expellingStudent").classList.add("hide");
      }

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
  if (
    filterActive.value === "Gryffindor" ||
    filterActive.value === "Slytherin" ||
    filterActive.value === "Hufflepuff" ||
    filterActive.value === "Ravenclaw"
  ) {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in House: ${StudentListToDisplay.length}`;
  } else if (
    filterActive.value === "Prefects" ||
    filterActive.value === "Expelled"
  ) {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in List: ${StudentListToDisplay.length}`;
  } else {
    document.querySelector(
      ".info_list"
    ).textContent = ` Total of Students: ${squadArray.length}`;
  }
  //append template student list to display in main_list container.
  return document.querySelector(".main_list").appendChild(listOverview);
}
//EXPELLING A STUDENT
function expelAStudent(studentListed) {
  if (!studentListed.expelled) {
    //close the details popop when student has been removed from list
    document.querySelector(".details").style.display = "none";
    studentListed.expelled = true;
    console.log(studentListed.expelled);
    expelledArray.push(studentListed);
    document
      .querySelector(".expellingStudent")
      .removeEventListener("click", expelAStudent(studentListed));
    console.log("removed listener");
    // filter all students to be expelled out from allStudents array so that student doesn't show up in list with !students.expelled
    allStudents = allStudents.filter(
      (student) =>
        student.firstName !== studentListed.firstName &&
        student.lastName !== studentListed.lastName
    );
    console.log(expelledArray, expelledArray.length);
    console.log(allStudents, allStudents.length);

    displayList(getFilterSortSearchValues());
  }
}

//ADDING OR REMOVING PREFECTS IN PREFECT ARRAY, BAD IMPLEMENTATION OF THIS FEATURE
function clickPrefect(studentListed) {
  if (studentListed.house === "Gryffindor") {
    console.log(studentListed.house, studentListed);
    if (!studentListed.prefect && gryfPrefectArray.length === 2) {
      console.log("gryf students", gryfPrefectArray.length);
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${gryfPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${gryfPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          gryfremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          gryfremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });

      console.log("removed has been clicked");
    } else if (!studentListed.prefect && gryfPrefectArray.length < 2) {
      studentListed.prefect = true;
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      document.querySelector(".removePrefect").classList.add("hide");
      gryftogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Slytherin") {
    console.log(studentListed.house, studentListed);
    if (!studentListed.prefect && slytPrefectArray.length === 2) {
      console.log("slytherin students", slytPrefectArray.length);
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${slytPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${slytPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          slytremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          slytremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });

      console.log("removed has been clicked");
    } else if (!studentListed.prefect && slytPrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      slyttogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Hufflepuff") {
    console.log(studentListed.house, studentListed);
    if (!studentListed.prefect && huffPrefectArray.length === 2) {
      console.log("hufflepuff students", huffPrefectArray.length);
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${huffPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${huffPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          huffremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          huffremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });

      console.log("removed has been clicked");
    } else if (!studentListed.prefect && huffPrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      hufftogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Ravenclaw") {
    console.log(studentListed.house, studentListed);
    if (!studentListed.prefect && ravePrefectArray.length === 2) {
      console.log("ravenclaw students");
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${ravePrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${ravePrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          raveremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          raveremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });

      console.log("removed has been clicked");
    } else if (!studentListed.prefect && ravePrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      ravetogglePrefect(studentListed);
    }
  }
}

//GRYFFINDOR PREFECTS FUNCTIONS ADD AND REMOVE - bad implementation
function gryfremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== gryfPrefectArray[0].firstName) {
    gryfPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(gryfPrefectArray[0], "im false");
    gryfPrefectArray.shift(studentPrefect);
    gryfPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;

  console.log(gryfPrefectArray);
}

function gryfremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== gryfPrefectArray[1].firstName) {
    gryfPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(gryfPrefectArray[1], "im false");
    gryfPrefectArray.shift(studentPrefect);
    gryfPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;
  console.log(gryfPrefectArray);
}

function gryftogglePrefect(studentPrefect) {
  console.log("Truthy");
  gryfPrefectArray.unshift(studentPrefect);
  console.log(gryfPrefectArray);

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;
}
//SLYTHERIN PREFECTS FUNCTIONS ADD AND REMOVE - bad implementation

function slytremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== slytPrefectArray[0].firstName) {
    slytPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(slytPrefectArray[0], "im false");
    slytPrefectArray.shift(studentPrefect);
    slytPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;

  console.log(slytPrefectArray);
}
function slytremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== slytPrefectArray[1].firstName) {
    slytPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(slytPrefectArray[1], "im false");
    slytPrefectArray.shift(studentPrefect);
    slytPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;

  console.log(slytPrefectArray);
}

function slyttogglePrefect(studentPrefect) {
  console.log("Truthy");
  slytPrefectArray.unshift(studentPrefect);
  console.log(slytPrefectArray);

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;
}

//HUFFLEPUFF PREFECT ADD AND REMOVE - bad implementation
function huffremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== huffPrefectArray[0].firstName) {
    huffPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(huffPrefectArray[0], "im false");
    huffPrefectArray.shift(studentPrefect);
    huffPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;

  console.log(huffPrefectArray);
}
function huffremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== huffPrefectArray[1].firstName) {
    huffPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(huffPrefectArray[1], "im false");
    huffPrefectArray.shift(studentPrefect);
    huffPrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;

  console.log(huffPrefectArray);
}

function hufftogglePrefect(studentPrefect) {
  console.log("Truthy");
  huffPrefectArray.unshift(studentPrefect);
  console.log(huffPrefectArray);

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;
}
//RAVENCLAW PREFECT ADD AND REMOVE - bad implementation
function raveremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== ravePrefectArray[0].firstName) {
    ravePrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(ravePrefectArray[0], "im false");
    ravePrefectArray.shift(studentPrefect);
    ravePrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;

  console.log(ravePrefectArray);
}
function raveremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== ravePrefectArray[1].firstName) {
    ravePrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    console.log(ravePrefectArray[1], "im false");
    ravePrefectArray.shift(studentPrefect);
    ravePrefectArray.unshift(studentPrefect);
  }
  console.log("remove a prefect yes");
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;

  console.log(ravePrefectArray);
}

function ravetogglePrefect(studentPrefect) {
  console.log("Truthy");
  ravePrefectArray.unshift(studentPrefect);
  console.log(ravePrefectArray);

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;
}

//INQ SQUAD
function clickSquadMember(studentListed) {
  if (studentListed.house === "Slytherin" || studentListed.isPure) {
    document.querySelector(".notSquadMember").classList.add("hide");
    studentListed.isSquadMember = true;
    squadArray.unshift(studentListed);
    console.log(squadArray);
    document.querySelector("#squadM").textContent = "yes";
    document.querySelector(
      ".squadIcon"
    ).src = `/picture_materials/Squad_icon.svg`;
    document.querySelector(".makeSquad").classList.add("hide");
    document.querySelector(".removeSquad").classList.remove("hide");
    console.log("popop not shown");
    console.log("Squad squad", studentListed, studentListed.isPure);
    document.querySelector(".makeSquad").removeEventListener("click", () => {
      clickSquadMember(studentListed);
    });
  } else {
    console.log(studentListed.house);
    document.querySelector("#squadM").textContent = "";
    document.querySelector(".squadIcon").src = ``;
    document.querySelector(".makeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").classList.add("hide");
    document.querySelector(".notSquadMember").classList.remove("hide");
    console.log("popop shown");
    document
      .querySelector(".notSquadMember button")
      .addEventListener("click", () => {
        document.querySelector(".notSquadMember").classList.add("hide");
        console.log("popop hidden");
      });
  }
}
function removeSquadMember(studentListed) {
  if (
    studentListed.isSquadMember &&
    filterActive.value === "Inquisitor Squad"
  ) {
    console.log("no squad member");
    studentListed[studentListed.isSquadMember] = false;
    squadArray.shift(studentListed);
    console.log(squadArray);
    document.querySelector(".squadIcon").src = ``;
    document.querySelector(".makeSquad").textContent = "Make Member";
    document.querySelector(".makeSquad").removeEventListener("click", () => {
      removeSquadMember(studentListed);
    });
  }
  if (studentListed.isSquadMember) {
    console.log("no squad member");
    studentListed.isSquadMember = false;

    console.log(squadArray);
    document.querySelector(".squadIcon").src = ``;
    document.querySelector(".makeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").classList.add("hide");
    document.querySelector(".makeSquad").removeEventListener("click", () => {
      removeSquadMember(studentListed);
    });
  }
}

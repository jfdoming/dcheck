import React, { useEffect, useState } from "react";
import "./App.css";
import { SUBJECTS_TRIE } from "./courses";
import TextSuggest from "./TextSuggest";
import Number from "./Number";
import Button from "./Button";
import { TERM_NAMES, TERMS_TRIE } from "./terms";

const didCourseRunInTerm = (subject, number, term) =>
  fetch(
    "/cgi-bin/cgiwrap/infocour/salook.pl?" +
      `level=under&sess=${term}&subject=${subject}&cournum=${number}`
  )
    .then(response => response.text())
    .then(text => text && !text.includes("Sorry"));

let termNumbers = nYears => {
  const date = new Date();
  const year = 1000 + (date.getFullYear() % 100) * 10;
  const term = Math.floor(date.getMonth() / 4);
  return Array(nYears * 3)
    .fill(null)
    .reduce((result, _, i) => {
      const base = year - Math.floor((i + (2 - term)) / 3) * 10;
      return [...result, base - 4 * (-i % 3) + 1];
    }, []);
};

const INITIAL_STATE = { 9: 0, 1: 0, 5: 0 };

const CourseResult = ({ nYears, subject, number, targetTerm }) => {
  const [totals, setTotals] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    termNumbers(nYears)
      .reduce(async (previous, term) => {
        const courseRanInTerm = await didCourseRunInTerm(subject, number, term);
        const oldResult = await previous;
        const key = term % 10;
        return {
          ...oldResult,
          [key]: courseRanInTerm + oldResult[key]
        };
      }, INITIAL_STATE)
      .then(result => setTotals(result))
      .finally(() => setLoading(false));
  }, [subject, number, nYears]);

  const targetTermID =
    (targetTerm &&
      (targetTerm.includes("Winter")
        ? 1
        : targetTerm.includes("Spring")
        ? 5
        : targetTerm.includes("Fall")
        ? 9
        : null)) ||
    null;
  let output;
  if (targetTermID) {
    output = (
      <div key="targetTerm">
        {subject} {number} will probably{" "}
        {totals[targetTermID] / nYears > 0.5 ? "" : "not "} be offered in{" "}
        {targetTerm}.
      </div>
    );
  } else {
    output = (
      <>
        {Object.entries(totals).map(([term, total]) => (
          <div key={term}>
            {TERM_NAMES[term]}: {Math.round(100 * (total / nYears))}% of terms
          </div>
        ))}
      </>
    );
  }

  return <div>{loading ? "Loading..." : output}</div>;
};

const suggestTerm = value => {
  return TERMS_TRIE.find(value).filter(s => s !== value);
};

const suggest = value => {
  const [subject, number] = getCourse(value);
  if (!subject) {
    return [];
  }
  const course = number ? `${subject} ${number}` : subject;
  const subjectSuggestions = SUBJECTS_TRIE.find(course);
  return subjectSuggestions.filter(s => s !== course);
};

const getCourse = course => {
  const match = /^\s*([a-zA-Z]{1,5})\s*([1-9][0-9]{0,2}[a-zA-Z]?)?\s*$/.exec(
    course
  );
  if (!match || !match.length || match.length === 1) {
    return [];
  }
  if (match.length === 2) {
    return [match[1].toUpperCase()];
  }
  return [match[1].toUpperCase(), match[2]];
};

const App = () => {
  const [course, setCurrentCourse] = useState("");
  const [nYears, setNYears] = useState(1);
  const [nYearsFetch, setNYearsFetch] = useState(nYears);
  const [subject, setSubject] = useState("");
  const [number, setNumber] = useState("");
  const [targetTerm, setTargetTerm] = useState("");
  const [targetTermFetch, setTargetTermFetch] = useState(targetTerm);

  const setCourseToFetch = () => {
    const [subject, number] = getCourse(course);
    if (!subject || !number) {
      return;
    }

    setSubject(subject);
    setNumber(number);
    setNYearsFetch(nYears);
    setTargetTermFetch(targetTerm);
  };

  return (
    <div className="query">
      <TextSuggest
        label="Course:"
        onChange={e => setCurrentCourse(e.target.value)}
        onSubmit={setCourseToFetch}
        suggest={suggest}
        value={course}
      />
      <Number
        label="Years back:"
        min="1"
        max="20"
        onChange={e => {
          const value = +e.target.value || 1;
          setNYears(value > 20 ? 20 : value < 1 ? 1 : value);
        }}
        onSubmit={setCourseToFetch}
        value={nYears}
      />
      <TextSuggest
        label="Desired term:"
        onChange={e => setTargetTerm(e.target.value)}
        onSubmit={setCourseToFetch}
        suggest={suggestTerm}
        value={targetTerm}
      />
      <Button onClick={setCourseToFetch} value="Submit" />

      {subject && number ? (
        <>
          <hr />
          <CourseResult
            key={`${subject} ${number}`}
            nYears={nYearsFetch}
            subject={subject}
            number={number}
            targetTerm={targetTermFetch}
          />
        </>
      ) : null}
    </div>
  );
};

export default App;

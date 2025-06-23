import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../App.css";
export default function PasswordGenerator() {
  const [Password, setPassword] = useState("");
  const [length, setLength] = useState(8);
  const [useNumbers, setUseNumbers] = useState(false);
  const [useCharacters, setUseCharacters] = useState(false);
  const passwordRef = useRef(null);
  const Numbers = () => {
    setUseNumbers(!useNumbers);
  };

  const Characters = () => {
    setUseCharacters(!useCharacters);
  };

  useEffect(() => {}, [useNumbers, useCharacters, length]);

  const rangelength = (e) => {
    setLength(e.target.value);
  };

  const passwordGenerator = useCallback(() => {
    let password = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (useNumbers) str += "0123456789";
    if (useCharacters) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      password += str.charAt(char);
    }

    setPassword(password);
  }, [length, useCharacters, useNumbers, setPassword]);
  useEffect(() => {
    passwordGenerator();
  }, [length, useCharacters, useNumbers, passwordGenerator]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(Password);
  }, [Password]);
  return (
    <div className="password-generator w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
      <h1 className="text-white text-center my-3">Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          ref={passwordRef}
          type="text"
          className="outline-none w-full py-1 px-3"
          value={Password}
          readOnly
        />
        <button
          className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0"
          onClick={copyPasswordToClipboard}
        >
          copy
        </button>
      </div>
      <div className="password-generator-options flex text-sm gap-x-2">
        <div className="flex items-center gap-x-1">
          <input
            min={6}
            max={100}
            type="range"
            onChange={(e) => rangelength(e)}
          />
          <label htmlFor="length">Length:{length}</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input type="checkbox" onChange={() => Numbers()} />
          <label htmlFor="numbers">Numbers</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input type="checkbox" onChange={() => Characters()} />
          <label htmlFor="characters">Special Characters</label>
        </div>
      </div>
    </div>
  );
}

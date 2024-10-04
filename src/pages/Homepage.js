import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import axios from "axios";
import Picture from "../components/Picture";

const Homepage = () => {
  let [input, setInput] = useState("");
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1);
  let [currentSearch, setCurrentSearch] = useState("");
  const auth = "fFYmzzCbiXEF7Q8qpfSVniuBgnXDTl6aL82GPS5b94BHNgtKfOknXIGE";
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  let searchURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=1`;

  const search = async (url) => {
    let reslut = await axios.get(url, {
      headers: { Authorization: auth },
    });
    setData(reslut.data.photos);
    setCurrentSearch(input);
  };

  //先用setPage+1了，但後面的newURL中的page還是1，WHY?
  //因為Closure，因為在page變成2之前，page已經先被設定成是1了，所以會讀到1
  const morePicture = async () => {
    let newURL;
    setPage(page + 1);
    if (currentSearch === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page + 1}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${
        page + 1
      }`;
    }
    let reslut = await axios.get(newURL, {
      headers: { Authorization: auth },
    });
    setData(data.concat(reslut.data.photos));
  };

  // 當homepage被渲染出來的時候，就會執行useEffect的函式{}
  useEffect(() => {
    search(initialURL);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          search(searchURL);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {/* Logical operator &&
        左手邊是true會算出右手邊的東西 如果是false會算出左手邊的東西 
        所以下面的式子，當data=null時，也就是false，
        所以下面的東西都會是null，因此不會展示任何東西出來，
        當data是true的時候，就會運算出&&後面的那些去製作array & pricture*/}
        {data &&
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morePicture}>更多圖片</button>
      </div>
    </div>
  );
};

export default Homepage;

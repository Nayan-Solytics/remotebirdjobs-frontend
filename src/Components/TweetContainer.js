import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import logo from "../logo.png";

export default function TweetContainer(props) {
  let { form, loading, setLoading } = props;
  const [tweet, setTweet] = useState([]);
  const [page, setPage] = useState(1);


  const loadTweets = async () => {
    const headers = { "Content-Type": "application/json" };
    let url = `https://remotebirdjobs-api.herokuapp.com/search/?search=${form.topic}&start_date=${form.startDate}&end_date=${form.endDate}&page=${page}&wfh=${form.type}&pagesize=12`;
    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => setTweet(data))
      .catch((err) => {
        console.log("Error => ", err);
      });
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 10000);
    loadTweets();
    // eslint-disable-next-line
  }, [form]);

  const fetchMoreData = async () => {
    setPage(page + 1);
    const headers = { 'Content-Type': 'application/json' };
    let url = `https://remotebirdjobs-api.herokuapp.com/search/?search=${form.topic}&start_date=${form.startDate}&end_date=${form.endDate}&page=${page + 1}&wfh=${form.type === 'wfh' ? 'true' : 'false'}&pagesize=12`;
    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => setTweet(tweet.concat(data)))
      .catch((err) => {
        console.log("Error => ", err);
      });
  };

  return (
    <>
      <div className="text-center">
        <div className="row d-flex justify-content-center mx-0">
          <img
            className="col-auto my-3 mx-0"
            style={{ borderRadius: "50%", width: "5%" }}
            src={logo}
            alt="logo"
          />
          <h1 className="col-auto my-3 mx-0 px-0">
            <u>Tweets</u>
          </h1>
        </div>
      </div>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={tweet.length}
        next={fetchMoreData}
        hasMore={tweet.length <= 47}
        endMessage={
          <h3 className="text-center">Yay!!! You have seen it all</h3>
        }
        loader={<Spinner />}
      >
        <div id="container" className="tweets-wrapper px-4 md:px-5">
          {tweet.map((element) => {
            return (
              <div
                key={element.id}
                className="p-0 overflow-auto scrollbar"
                style={{  height: '25vh', borderRadius: '12px' }}
              >
                <Tweet id={element.id} className="p-0"></Tweet>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </>
  );
}

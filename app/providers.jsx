"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store";

export function Providers({ children }) {
  // const storeRef = useRef({ ...AppStore });
  // const [, forceRender] = useState(0);
  // useEffect(() => {
  //   if (!storeRef.current) {
  //     storeRef.current = makeStore();
  //     forceRender((n) => n + 1);
  //   }
  // }, [])
  // if (!storeRef.current) return null;

  const [store] = useState(() => makeStore());


  return <Provider store={store}>{children}</Provider>;
}

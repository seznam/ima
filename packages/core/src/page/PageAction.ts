type PageAction = {
  action: string,
  event: Event & {
    state: {
      scroll: { 
        x: number,
        y: number
      }
    }
  },
  type: string,
  url: string
};

export default PageAction;

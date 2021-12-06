import { FunctionComponent } from 'react';
import { Button } from '#/components';
import { useFramesStore } from '#/stores/framesStore';

type HeaderProps = {
  name: string;
  message: string;
};

const Header: FunctionComponent<HeaderProps> = ({ name, message }) => {
  const { state, dispatch } = useFramesStore();

  return (
    <div className="flex flex-row justify-between items-center my-3">
      <h1 className="font-mono text-2xl tracking-tighter text-red-500">
        <span className="font-semibold">{name}:</span> {message}
      </h1>
      <Button
        onClick={() =>
          dispatch({
            type: state.showOriginal ? 'viewCompiled' : 'viewOriginal'
          })
        }>
        {state.showOriginal ? <>View compiled</> : <>View original</>}
      </Button>
    </div>
  );
};

export { Header };

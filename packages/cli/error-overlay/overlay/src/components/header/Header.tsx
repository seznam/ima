import { FunctionComponent } from 'react';
import { Button } from '#/components';
import { useFramesStore } from '#/stores/framesStore';

const Header: FunctionComponent = () => {
  const { state, dispatch } = useFramesStore();

  return (
    <div className="flex flex-row justify-between items-center my-3">
      <h1 className="font-mono text-2xl tracking-tighter text-red-500">
        <span className="font-semibold">{state.name}:</span> {state.message}
      </h1>
      <Button
        onClick={() =>
          dispatch({
            type: state.showOriginal ? 'viewCompiled' : 'viewOriginal'
          })
        }>
        View {state.showOriginal ? 'compiled' : 'original'}
      </Button>
    </div>
  );
};

export { Header };


export function WinLine(props)
{
    if(props.winner_combo === null)
    {
        return <div></div>
    }
    else
    {
        if(props.winner_combo[0] === 0 && props.winner_combo[1] === 1 && props.winner_combo[2] === 2)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap r1"></div>
        }
        if(props.winner_combo[0] === 3 && props.winner_combo[1] === 4 && props.winner_combo[2] === 5)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap r2"></div>
        }
        if(props.winner_combo[0] === 6 && props.winner_combo[1] === 7 && props.winner_combo[2] === 8)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap r3"></div>
        }
        if(props.winner_combo[0] === 0 && props.winner_combo[1] === 3 && props.winner_combo[2] === 6)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap c1"></div>
        }
        if(props.winner_combo[0] === 1 && props.winner_combo[1] === 4 && props.winner_combo[2] === 7)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap c2"></div>
        }
        if(props.winner_combo[0] === 2 && props.winner_combo[1] === 5 && props.winner_combo[2] === 8)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap c3"></div>
        }
        if(props.winner_combo[0] === 0 && props.winner_combo[1] === 4 && props.winner_combo[2] === 8)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap fsl"></div>
        }
        if(props.winner_combo[0] === 2 && props.winner_combo[1] === 4 && props.winner_combo[2] === 6)
        {
            console.log(props.winner_combo);
            return <div className="winner_wrap bsl"></div>
        }
        return <div className="winner_wrap"></div>
    }
    
}
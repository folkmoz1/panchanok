import CommentList from "./Comment--List";
import DotLoad from "../Loader/dotLoad";


const Comment = ({me, comments}) => {


    if (!comments) {

        return (
            <>
                <DotLoad />
            </>
        )
    }

    return (
        <>
            {
                me &&
                <hr className={'my-3 d-none md:block'}/>
            }
            <div>
                <ul>
                    {
                        comments.map(comment => (
                            <CommentList me={me} comment={comment} key={comment.createdAt}/>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default Comment

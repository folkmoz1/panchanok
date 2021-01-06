import Image from "next/image";
import styled from 'styled-components'

const Card = styled.div`
  display: inline-block;
  width: 300px;
  height: 400px;
  overflow: hidden;
  border-radius: 1rem;
  margin: 10px;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, .4);
  position: relative;
  font-size: 100%;
  cursor: pointer;


  &:hover {
    box-shadow: 0 0 6px 5px rgb(243, 189, 189);
  }

  &:hover .content {
    opacity: 1;
  }

  .title {
    color: white;
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
    text-shadow: 0px 0px 4px black;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, .7);
    border-bottom-left-radius: 1rem
  }

  .content {
    padding: 25px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(250, 235, 235);
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    -moz-transition: 0.5s all;
    transition: 0.5s all
  }

  .author {
    font-weight: bold;
    font-size: 170%;
    color: #cb3837;
  }

  .title-in {
    color: grey;
    font-size: 110%;
  }

  .description {
    margin-top: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  pre {
    min-height: 150px;
    padding: 1rem;
    border: 4px dotted #e28b8b;
    border-radius: 1rem;
    font-size: 110%;
  }
`


const Card__Component = ({ post }) => {

    const { images, title, author, desc } = post


    return (
        <>
            <Card>
                <Image src={images[0].url} layout={'fill'} objectFit={'cover'} alt={author}/>
                <h1 className={'title'}>{title}</h1>
                <div className="content">
                    <p className={'author'}>{author}</p>
                    <p className="title-in"> {title}</p>
                    <div className={'description'}>
                        <label className={'text-gray-700 font-bold'}>description</label>
                        <pre className={'text-gray-700'}>{desc}</pre>
                    </div>
                </div>
            </Card>
        </>
    )
}


export default Card__Component
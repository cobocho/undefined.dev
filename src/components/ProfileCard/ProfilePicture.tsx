import Image from 'next/image';
import styled from 'styled-components';

import profile_picture from '../../../public/assets/profile/profile_picture.png';

const ProfilePicture = () => {
  return (
    <Container>
      <Image src={profile_picture} alt="profile" placeholder="blur" fill sizes="100%" loading="lazy" />
    </Container>
  );
};
const Container = styled.figure`
  position: relative;

  width: 70%;
  aspect-ratio: 1 / 1;

  margin: 0 auto;

  border: solid 3px ${({ theme }) => theme.content};
  border-radius: 50%;

  overflow: hidden;

  background-color: #b3b3b3;

  box-shadow: 0px 0px 50px -5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0px 0px 50px -5px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 0px 50px -5px rgba(0, 0, 0, 0.2);

  @media (max-width: 900px) {
    margin: 30px auto;
  }
`;

export default ProfilePicture;

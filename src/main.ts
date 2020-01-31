import Album from './models/Album';
import User from './models/User';
import Photo from './models/Photo';


async function run(): Promise<void> {
  // Albums
  // const album = await Album.findById<Album>(1);

  // const albums = await Album.find<Album>();
  // console.log(albums);

  const album = await Album.create<Album>({
    title: 'We will rock you',
    userId: 1,
  });
  console.log(album);

  // await Album.deleteById(106);


  // Users
  // const user = await User.findById(1);
  // console.log(user);
  //
  // const users = await User.find<User>();
  // console.log(users);

  // Photos
  // const photo = await Photo.findById(1);
  // console.log(photo);
  //
  // const photos = await Photo.find<Photo>();
  // console.log(photos);
}


run().catch((err) => {
  console.error(err);
});

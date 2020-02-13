import Album from './models/Album';
import User from './models/User';
import Photo from './models/Photo';
import { QueryFilter, QueryFilterOrder } from './utils/helpers';


async function run(): Promise<void> {
  // =========================== Albums ======================================

  // ---- FIND BY ID -----
  const album = await Album.findById<Album>(2, {
    includes: ['photos'],
  });

  // album.user.name = 'The Grinch';
  // await album.user.save();
  console.log(album);

  // ---- FIND -----
  // const albums = await Album.find<Album>();
  // const albums = await Album.find<Album>({
  //   where: {
  //     userId: 1,
  //   },
  //   limit: 5,
  //   sort: 'id',
  //   order: QueryFilterOrder.Desc,
  // });
  // console.log(albums);

  // ---- CREATE -----
  // let album = await Album.create<Album>({
  //   title: 'We will rock you',
  //   userId: 1,
  // });
  // console.log(album);

  // ---- UPDATE BY ID -----
  // album.title = 'Woush';
  // album = await Album.updateById<Album>(album);
  // console.log(album);

  // ---- UPDATE BY ID -----
  // const album = await Album.updateById(112, {
  //   userId: 1,
  //   title: 'Tata',
  // });
  // console.log(album);

  // ---- DELETE -----
  // await Album.deleteById(106);

  // ---- SAVE -----
  // album.title = 'Ola Que talll ???';
  // await album.save<Album>();
  // console.log(album);

  // ---- UPDATE -----
  // await album.update<Album>({
  //   title: 'Coucou',
  // });
  // console.log(album);

  // ---- REMOVE -----
  // await album.remove();


  // =========================== Users ======================================
  // const user = await User.findById(1);
  // console.log(user);

  // const users = await User.find<User>();
  // console.log(users);

  // =========================== Photos ======================================

  // Photos
  // const photo = await Photo.findById(1);
  // console.log(photo);

  // const photos = await Photo.find<Photo>();
  // console.log(photos);
}


run().catch((err) => {
  console.error(err);
});

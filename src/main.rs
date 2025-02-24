use bevy::{
    pbr::{CascadeShadowConfigBuilder, DirectionalLightShadowMap},
    prelude::*,
};
use bevy_flycam::prelude::*;


#[derive(Resource)]
struct MuseumAssets {
    is_loaded: bool,
    handle: SceneRoot,
}

fn main() {
    App::new()
        .add_plugins((
            DefaultPlugins,
            PlayerPlugin,
        ))
        .insert_resource(DirectionalLightShadowMap { size: 4096})
        .add_systems(Startup, (load_museum, spawn_museum.after(load_museum)))
        .run();
}
fn load_museum(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
) {

    // Start loading the assets.
    commands.insert_resource(MuseumAssets {
        is_loaded: false,
        handle: SceneRoot(asset_server.load(GltfAssetLabel::Scene(0).from_asset("models/museum.glb"))),
    });

}
fn spawn_museum(
    mut commands: Commands,
    museum_assets: Res<MuseumAssets>
) {
    commands.spawn((
        DirectionalLight {
            shadows_enabled: true,
            ..default()
        },
        CascadeShadowConfigBuilder {
            num_cascades: 1,
            maximum_distance: 1.6,
            ..default()
        }
            .build(),
        ));
    commands.spawn(museum_assets.handle.clone());
}
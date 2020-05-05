import sys
import maya

from settings.constants import FRONTEND_DIR, DATA_DIR

sys.path.append("/home/hubcraft/git/thisisthesitebuilder")

from thisisthesitebuilder.ensure_build_path import add_project_dir_to_path, BUILD_PATH
from thisisthesitebuilder.utils.file_utils import get_hashes

add_project_dir_to_path()

if __name__ == "__main__":
    import django
    django.setup()


print(sys.path)
from thisisthesitebuilder.pages.build import PageBuilder

hashes = get_hashes(DATA_DIR)
build_time = maya.now()
build_meta = {'data_checksum': hashes['data'],
              'datetime': build_time,
              'frontend_dir': FRONTEND_DIR,
              'data_dir': DATA_DIR,
              }

page_builder = PageBuilder(build_meta, force_rebuild=False)





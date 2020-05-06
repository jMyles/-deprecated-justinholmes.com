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

page = page_builder.build_page("index", template_name="shared/detail.html", root=True, active_context={'meta_description':"I program. I travel. I teach. I invent.  This is the personal web presence of Justin Myles Holmes."})
page = page_builder.build_page("now", root=True, compact=True, template_name="shared/detail.html")
page = page_builder.build_page("before", template_name="shared/time-series.html", root=True, compact=True)
page = page_builder.build_page("talks", template_name="shared/time-series.html", root=True, compact=True)

page = page_builder.build_page("best-argument-against-herd-immunity")


